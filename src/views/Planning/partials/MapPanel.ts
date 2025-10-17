'use client';

import mapboxgl from 'mapbox-gl';
import { Panel, GlobalEvents, DomHelper, StringHelper, StoreListeners, Toast, EventHelper } from '@bryntum/core-thin';
import { TimeAxis } from '@bryntum/scheduler-thin';
import { constructParams, MarkerConfig, PopupConfig } from '../../../lib/types';
import Task from './Task';
import { EventStore } from '@bryntum/schedulerpro-thin';

class CustomTimeAxis extends TimeAxis {
  declare isTimeSpanInAxis: (eventRecord: Task) => boolean;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const detectWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const supported = Boolean(canvas.getContext('webgl'));
    canvas.remove();
    return supported;
  }
  catch (e) {
    return false;
  }
};

export default class MapPanel extends Panel {
  static override type = 'mappanel';
  static override $name = 'MapPanel';

  declare map: mapboxgl.Map;
  declare popup: mapboxgl.Popup;
  declare lng: number;
  declare lat: number;
  declare zoom: number;
  declare eventStore: EventStore;
  declare timeAxis: CustomTimeAxis;

  static get configurable() {
    return {
      monitorResize: true,
      zoom: 11,
      lat: 40.7128,
      lng: -74.0060,
      textContent: false,
      collapsible: true,
      header: false,
    };
  }

  constructor(args: constructParams) {
    super(args);

    this.setMapStyle();
  }

  override construct(...args: constructParams[]) {
    super.construct(...args);

    if (!detectWebGL()) {
      Toast.show({
        html: `ERROR! Can not show show maps. WebGL is not supported!`,
        color: 'b-red',
        style: 'color:white',
        timeout: 0
      });
      return;
    }

    const mapContainerEl = this.contentElement;

    this.map = new mapboxgl.Map({
      container: mapContainerEl,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.lng, this.lat],
      zoom: this.zoom
    });

    this.map.on('load', async () => {
      if (this.isDestroying) {
        return;
      }

      mapContainerEl.classList.add('maploaded');

      await this.eventStore.commit();

      this.onStoreChange({
        action: 'dataset',
        records: this.eventStore.records,
        source: this.eventStore,
        record: this.eventStore.records[0],
        changes: {}
      });
    });

    this.eventStore.on('change', this.onStoreChange, this);
    this.timeAxis.on('reconfigure', this.onTimeAxisReconfigure, this);

    EventHelper.addListener(mapContainerEl, 'click', this.onMapClick, { delegate: '.mapboxgl-marker', element: mapContainerEl, thisObj: this });
    GlobalEvents.on({
      theme: 'setMapStyle',
      thisObj: this,
    });
  }

  addEventMarker(eventRecord: Task) {
    if (!eventRecord.address) return;

    const { lat, lng } = eventRecord.address;
    if (!lat || !lng || (!this.timeAxis.isTimeSpanInAxis(eventRecord) && eventRecord.isScheduled)) return;

    const marker = this.createMarker(eventRecord, lat, lng);
    this.attachMarkerToEvent(marker, eventRecord);
  }

  private createMarker(eventRecord: Task, lat: number, lng: number) {
    const color = '#f0f0f0';
    return new mapboxgl.Marker({ color } as MarkerConfig).setLngLat([lng, lat]);
  }

  private attachMarkerToEvent(marker: mapboxgl.Marker, eventRecord: Task) {
    marker.getElement().id = eventRecord.id.toString();
    eventRecord.marker = marker;
    (marker as any).eventRecord = eventRecord;
    marker.addTo(this.map);
  }

  removeEventMarker(eventRecord: Task) {
    const marker = eventRecord.marker;
    if (marker) {
      if ((marker as any).popup) {
        (marker as any).popup.remove();
        (marker as any).popup = null;
      }
      marker.remove();
    }
    (eventRecord as any).marker = null;
  }

  removeAllMarkers() {
    this.eventStore.forEach((eventRecord: Task) => this.removeEventMarker(eventRecord));
  }

  scrollMarkerIntoView(eventRecord: Task) {
    const marker = eventRecord.marker;
    this.map.easeTo({ center: marker.getLngLat() });
  }

  showTooltip(eventRecord: Task, centerAtMarker: boolean) {
    const marker = eventRecord.marker;
    this.popup?.remove();

    if (centerAtMarker) {
      this.scrollMarkerIntoView(eventRecord);
    }

    this.createAndShowPopup(eventRecord, marker);
  }

  private createAndShowPopup(eventRecord: Task, marker: mapboxgl.Marker) {
    const popup = this.popup = (marker as any).popup = new mapboxgl.Popup({
      offset: [0, -21]
    } as PopupConfig);

    popup
      .setLngLat(marker.getLngLat())
      .setHTML(this.createPopupContent(eventRecord))
      .addTo(this.map);
  }

  private createPopupContent = (eventRecord: Task) => StringHelper.xss`
        <span class="event-name">${eventRecord.name}</span>
        <span class="resource"><i class="fa fa-fw fa-user"></i>${eventRecord.resource?.name || 'Unassigned'}</span>
        <span class="location"><i class="fa fa-fw fa-map-marker-alt"></i>${eventRecord.shortAddress}</span>
    `;

  onMapClick({ target }: { target: mapboxgl.Marker }) {
    const markerEl = (target as any).closest('.mapboxgl-marker');
    if (!markerEl) return;

    const eventRecord = this.eventStore.getById(markerEl.id) as Task;
    this.showTooltip(eventRecord, true);
    this.trigger('markerclick', {
      marker: eventRecord.marker,
      eventRecord
    });
  }

  override onResize = () => {
    this.map?.resize();
  };

  onTimeAxisReconfigure() {
    this.eventStore.forEach((eventRecord: Task) => {
      this.removeEventMarker(eventRecord);
      this.addEventMarker(eventRecord);
    });
  }

  setMapStyle() {
    const
      isDark = (DomHelper.themeInfo as { name?: string })?.name?.toLowerCase().match('dark'),
      mapStyle = isDark ? 'dark-v10' : 'streets-v11';

    this.map.setStyle('mapbox://styles/mapbox/' + mapStyle);
  }

  async onStoreChange(event: Parameters<NonNullable<Exclude<StoreListeners['change'], string>>>[0]) {
    await this.eventStore.commit();

    switch (event.action) {
      case 'add':
      case 'dataset':
        if (event.action === 'dataset') {
          this.removeAllMarkers();
        }
        event.records.forEach((eventRecord) => this.addEventMarker(eventRecord as Task));
        break;

      case 'remove':
        event.records.forEach((eventRecord) => this.removeEventMarker(eventRecord as Task));
        break;

      case 'update': {
        const eventRecord = event.record as Task;

        if (!eventRecord) return;
        this.removeEventMarker(eventRecord);
        this.addEventMarker(eventRecord);

        break;
      }

      case 'filter': {
        const renderedMarkers: Task[] = [];

        this.eventStore.query((rec: Task) => rec.marker, true).forEach((eventRecord) => {
          if (!event.records.includes(eventRecord as Task)) {
            this.removeEventMarker(eventRecord as Task);
          }
          else {
            renderedMarkers.push(eventRecord as Task);
          }
        });

        event.records.forEach((eventRecord) => {
          const task = eventRecord as Task;
          if (!renderedMarkers.includes(task)) {
            this.addEventMarker(task);
          }
        });

        break;
      }
    }
  }
};

MapPanel.initClass();
