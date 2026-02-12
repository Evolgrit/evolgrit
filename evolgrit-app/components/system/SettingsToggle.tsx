import React from "react"
import { Switch } from "tamagui"

type Props = {
  value: boolean
  onValueChange: (v: boolean) => void
  disabled?: boolean
}

/**
 * Clean iOS-like toggle (no liquid glass).
 * Uses Tamagui Switch with subtle track + white thumb.
 */
export function SettingsToggle({ value, onValueChange, disabled }: Props) {
  return (
    <Switch
      checked={value}
      onCheckedChange={(checked) => onValueChange(!!checked)}
      disabled={disabled}
      width={52}
      height={32}
      borderRadius={999}
      backgroundColor={value ? "#34C759" : "rgba(0,0,0,0.12)"}
      padding={2}
      borderWidth={0}
      opacity={disabled ? 0.5 : 1}
    >
      <Switch.Thumb
        width={28}
        height={28}
        borderRadius={999}
        backgroundColor="#fff"
      />
    </Switch>
  )
}
