"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faComment } from "@fortawesome/free-regular-svg-icons";
import { faStopwatch, faBox, faTags } from "@fortawesome/free-solid-svg-icons";
import { Item } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../../../components/ui/overlays/dialog";
import {
  BryntumButton,
  BryntumCombo,
  BryntumNumberField,
  BryntumTextField,
  BryntumTimeField,
} from "@bryntum/core-react-thin";
import { useDate } from "../../../../../contexts/date-context";

interface DeliveryFormValues {
  comment: string;
  type: "URGENT" | "REGULAR" | "SPECIAL";
  plannedFrom: Date;
  durationInMinutes: number;
  itemId: string;
}

interface CreateDeliveryModalProps {
  onDeliveryCreated: () => void;
}

const CreateDeliveryModal = ({
  onDeliveryCreated,
}: CreateDeliveryModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const { selectedDate } = useDate();

  const defaultDate = new Date(selectedDate);
  defaultDate.setHours(10, 0, 0, 0);

  // Form state
  const [formData, setFormData] = useState<DeliveryFormValues>({
    comment: "",
    type: "REGULAR",
    plannedFrom: defaultDate,
    durationInMinutes: 0,
    itemId: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<
    Partial<Record<keyof DeliveryFormValues, string>>
  >({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items");

        if (!response.ok) throw new Error("Failed to fetch items");

        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DeliveryFormValues, string>> = {};

    if (!formData.comment.trim()) {
      newErrors.comment = "Comment is required";
    }
    if (!formData.plannedFrom) {
      newErrors.plannedFrom = "Planned time is required";
    }
    if (formData.durationInMinutes <= 0) {
      newErrors.durationInMinutes = "Duration must be greater than 0";
    }
    if (!formData.itemId) {
      newErrors.itemId = "Item is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update form field
  const updateFormField = <K extends keyof DeliveryFormValues>(
    field: K,
    value: DeliveryFormValues[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      comment: "",
      type: "REGULAR",
      plannedFrom: defaultDate,
      durationInMinutes: 0,
      itemId: "",
    });
    setErrors({});
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("/api/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          plannedFrom: formData.plannedFrom.toISOString(),
          durationInMinutes: formData.durationInMinutes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create delivery");
      }

      setIsOpen(false);
      resetForm();
      onDeliveryCreated();
    } catch (error) {
      console.error("Error creating delivery:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <BryntumButton
          text="Create Delivery"
          icon="fa fa-plus"
          cls="!bg-teal-500 !text-white hover:!bg-teal-600 !rounded-full !h-10"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-teal-950">
            Create New Delivery
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Comment Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-teal-950 flex items-center gap-2">
              <FontAwesomeIcon icon={faComment} className="h-4 w-4" />
              Comment
            </label>
            <BryntumTextField
              width="100%"
              value={formData.comment}
              onChange={({ value }) =>
                updateFormField("comment", value as string)
              }
            />
            {errors.comment && (
              <p className="text-xs text-red-500">{errors.comment}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-teal-950 flex items-center gap-2">
              <FontAwesomeIcon icon={faTags} className="h-4 w-4" />
              Type
            </label>
            <BryntumCombo
              width="100%"
              items={["URGENT", "REGULAR", "SPECIAL"]}
              value={formData.type}
              onChange={({ value }) =>
                updateFormField(
                  "type",
                  value as "URGENT" | "REGULAR" | "SPECIAL"
                )
              }
            />
            {errors.type && (
              <p className="text-xs text-red-500">{errors.type}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-teal-950 flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
              Planned Time
            </label>
            <BryntumTimeField
              width="100%"
              height="40px"
              value={formData.plannedFrom}
              onChange={({ value }) =>
                updateFormField("plannedFrom", value as Date)
              }
            />
            {errors.plannedFrom && (
              <p className="text-xs text-red-500">{errors.plannedFrom}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-teal-950 flex items-center gap-2">
              <FontAwesomeIcon icon={faStopwatch} className="h-4 w-4" />
              Duration (minutes)
            </label>
            <BryntumNumberField
              value={formData.durationInMinutes}
              onChange={({ value }) =>
                updateFormField("durationInMinutes", Number(value as number))
              }
              width="100%"
              height="40px"
              step={15}
            />
            {errors.durationInMinutes && (
              <p className="text-xs text-red-500">{errors.durationInMinutes}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-teal-950 flex items-center gap-2">
              <FontAwesomeIcon icon={faBox} className="h-4 w-4" />
              Item
            </label>
            <BryntumCombo
              width="100%"
              items={items}
              valueField="id"
              displayField="name"
              value={formData.itemId}
              onChange={({ value }) =>
                updateFormField("itemId", value as string)
              }
            />
            {errors.itemId && (
              <p className="text-xs text-red-500">{errors.itemId}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <BryntumButton
              text="Create Delivery"
              icon="fa fa-plus"
              cls="!bg-teal-500 !text-white hover:!bg-teal-600 !rounded-full !h-10"
              onClick={onSubmit}
            />
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDeliveryModal;
