/**
 * @fileoverview Demo — ListPanel with a world-cities tour and StatusChronometer integration (no label)
 * @module demo/status-chronometer-cities3
 *
 * Variant of the status-chronometer-cities2 demo with the Chronometer `title`
 * prop set to `undefined`, so no panel label is rendered above the time
 * display. All other behaviour is identical: the tour automatically visits each
 * city every 1.8 s, the badge shows a spinner while running and a green ✓ Done
 * when all cities have been visited, and the chronometer tracks total elapsed
 * time. The border is also disabled (`showBorder: false`).
 * Navigate with ↑ / ↓ (or k / j), Tab to toggle chronometer focus, q to quit.
 *
 * Run with:
 *   npx tsx demos/status-chronometer-cities3.tsx
 *
 * @version 1.0.0
 * @since 2026-04-06
 */

import React, { useState, useEffect } from 'react';
import { render, Box, Text, useApp, useInput } from 'ink';
import { ListPanel } from '../src/ListPanel.js';
import type { ListItem } from '../src/ListPanel.js';
import { StatusChronometer } from '../src/status_chronometer.js';
import type { PanelStatus } from '../src/types.js';

// ── Data ──────────────────────────────────────────────────────────────────────

export const CITIES: string[] = [
  'Tokyo', 'Delhi', 'Shanghai', 'São Paulo', 'Mexico City',
  'Cairo', 'Mumbai', 'Beijing', 'Dhaka', 'Osaka',
  'New York', 'Karachi', 'Buenos Aires', 'Istanbul', 'Lagos',
];

export const VISIT_MS = 1800;

// ── Helpers ───────────────────────────────────────────────────────────────────

function cityId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

function buildItems(
  cities: string[],
  currentIndex: number,
  durations: Record<string, number>,
): Record<string, ListItem> {
  return Object.fromEntries(
    cities.map((city, i) => {
      const id = cityId(city);
      const status: string =
        i < currentIndex ? 'done' : i === currentIndex ? 'running' : 'pending';
      return [id, { id, name: city, status, duration: durations[id] ?? null }];
    }),
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export function CitiesApp(): React.ReactElement {
  const { exit } = useApp();

  const [tourIndex, setTourIndex] = useState<number>(0);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [tourDone, setTourDone] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chronometerFocused, setChronometerFocused] = useState<boolean>(false);

  // Advance the tour one city at a time
  useEffect(() => {
    if (tourDone) return;
    const t0 = Date.now();
    const timer = setTimeout(() => {
      const elapsed = Date.now() - t0;
      const id = cityId(CITIES[tourIndex] ?? '');
      setDurations((prev) => ({ ...prev, [id]: elapsed }));
      setTourIndex((prev) => {
        const next = prev + 1;
        if (next >= CITIES.length) {
          setTourDone(true);
          return CITIES.length; // past-the-end → all items become 'done'
        }
        return next;
      });
    }, VISIT_MS);
    return () => clearTimeout(timer);
  }, [tourIndex, tourDone]);

  useInput((input) => {
    if (input === 'q') exit();
    if (input === '\t') setChronometerFocused((prev) => !prev);
  });

  const currentId = tourDone ? null : cityId(CITIES[tourIndex] ?? '');
  const items = buildItems(CITIES, tourIndex, durations);
  const tourStatus: PanelStatus = tourDone ? 'done' : 'loading';

  return React.createElement(
    Box,
    { flexDirection: 'column', padding: 1 },
    React.createElement(
      Text,
      { bold: true, color: 'white' },
      'World Cities Tour  ·  ↑/↓  navigate  ·  Tab  focus chronometer  ·  q  quit',
    ),
    React.createElement(Box, { marginTop: 1 }),
    React.createElement(ListPanel, {
      items,
      currentItemId: currentId,
      width: 44,
      height: 20,
      isFocused: !chronometerFocused,
      title: 'CITIES',
      selectedItemId: selectedId,
      onSelectItem: setSelectedId,
    }),
    React.createElement(Box, { marginTop: 1 }),
    React.createElement(StatusChronometer, {
      status: tourStatus,
      width: 44,
      isFocused: chronometerFocused,
      title: undefined,
      showBorder: false,
    }),
  );
}

// ── Entry point ───────────────────────────────────────────────────────────────

render(React.createElement(CitiesApp, null));
