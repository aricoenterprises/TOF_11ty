import React, { useCallback } from 'react'
import { Stack, Button } from '@sanity/ui'
import { AddIcon } from '@sanity/icons'
import { insert, set } from 'sanity'

function randomKey() {
  return Math.random().toString(36).slice(2, 10)
}

/**
 * Custom array input that places an "Add item" button at the TOP
 * instead of Sanity's default position at the bottom.
 * New items are inserted at index 0 (prepended).
 */
export function PrependArrayInput(props) {
  const { value, schemaType, onChange, renderDefault } = props

  const handleAddAtTop = useCallback(() => {
    const itemType = schemaType.of[0]
    const newItem = { _type: itemType.name, _key: randomKey() }
    const patch = (!value || value.length === 0)
      ? set([newItem])
      : insert([newItem], 'before', [0])
    onChange(patch)
  }, [value, schemaType, onChange])

  return (
    <Stack space={3}>
      <Button
        icon={AddIcon}
        text="Add item"
        mode="ghost"
        tone="primary"
        onClick={handleAddAtTop}
        style={{ width: '100%' }}
      />
      {renderDefault(props)}
    </Stack>
  )
}
