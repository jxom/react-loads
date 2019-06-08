/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the facebook/github GitHub repository.
 */

export function createLRU(limit) {
  // Circular, doubly-linked list
  let first = null;

  function add(value, onDelete) {
    const entry = {
      value,
      onDelete,
      next: null,
      previous: null
    };
    if (first === null) {
      entry.previous = entry.next = entry;
      first = entry;
    } else {
      // Append to head
      const last = first.previous;
      last.next = entry;
      entry.previous = last;

      first.previous = entry;
      entry.next = first;

      first = entry;
    }
    return entry;
  }

  function update(entry, newValue) {
    entry.value = newValue;
  }

  function access(entry) {
    const next = entry.next;
    if (next !== null) {
      // Entry already cached
      const resolvedFirst = first;
      if (first !== entry) {
        // Remove from current position
        const previous = entry.previous;
        previous.next = next;
        next.previous = previous;

        // Append to head
        const last = resolvedFirst.previous;
        last.next = entry;
        entry.previous = last;

        resolvedFirst.previous = entry;
        entry.next = resolvedFirst;

        first = entry;
      }
    } else {
      // Cannot access a deleted entry
      // TODO: Error? Warning?
    }
    // scheduleCleanUp();
    return entry.value;
  }

  return {
    add,
    update,
    access
  };
}
