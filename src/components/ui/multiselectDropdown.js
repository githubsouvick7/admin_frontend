"use client"

import React, { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"

export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Select options",
  valueKey = "_id",
  labelKey = "brand_name",
}) {
  const [open, setOpen] = useState(false)

  const toggleOption = (selectedValue) => {
    if (!onChange) return

    if (value.includes(selectedValue)) {
      onChange(value.filter((v) => v !== selectedValue))
    } else {
      onChange([...value, selectedValue])
    }
  }

  const selectedLabels = options
    .filter((item) => value.includes(String(item[valueKey])))
    .map((item) => item[labelKey])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full h-9 justify-between"
        >
          <span className="truncate">
            {selectedLabels.length > 0
              ? selectedLabels.join(", ")
              : placeholder}
          </span>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup className="max-h-60 overflow-y-auto">
            {options.map((item) => {
              const itemValue = String(item[valueKey])
              const itemLabel = item[labelKey]
              const isSelected = value.includes(itemValue)

              return (
                <CommandItem
                  key={itemValue}
                  onSelect={() => toggleOption(itemValue)}
                  className="flex justify-between"
                >
                  <span className="text-xs font-semibold">{itemLabel}</span>

                  <Check
                    className={cn(
                      "h-4 w-4",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}