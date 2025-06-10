// Web fallback for react-native-maps
// This file is used by Metro when building for web to replace react-native-maps

import React from 'react';
import { View } from 'react-native';

// Export empty components that match react-native-maps API
export default function MapView(props) {
  return React.createElement(View, props);
}

export function Marker(props) {
  return React.createElement(View, props);
}

export function Circle(props) {
  return React.createElement(View, props);
}

export function Polyline(props) {
  return React.createElement(View, props);
}

export function Polygon(props) {
  return React.createElement(View, props);
}

export function Callout(props) {
  return React.createElement(View, props);
} 