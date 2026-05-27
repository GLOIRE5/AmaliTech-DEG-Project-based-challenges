# SupportFlow Visual Builder

Visual chatbot flow builder to build and test flows for customer support with Vanilla JavaScript and SVG connections.

---

# Figma Design

This is a link to your Figma project: https://www.figma.com/design/GoO89WBlmZwonMnQRGqr4T/SupportFlow?node-id=0-1&t=wUPVWKB4HVI9nQ8P-1


# Features

## Visual Flow Graph

- Converts JSON chatbot conversations into nodes
All nodes will be placed on a x/y grid.
Custom SVG lines are used to connect nodes.
- No external graph libraries used

## Live Node Editing

 Edit a node by clicking on it.
Keep question text up to date.
 Immediate changes on the canvas.
 Reduces use of local state to a minimum

## Preview Mode

Switch to and from Editor Mode and Preview Mode.
 Simulate chatbot conversations
 Follow the flow according to the chosen answers
 Restart conversation when reaching the end

This feature allows you to drag and drop nodes.This feature enables drag and drop nodes.

 Drag nodes anywhere on canvas.
When you update the connection lines, they adjust automatically.
Makes flow organization easier for users

### Why This Feature Matters

It is essential that support teams have a visual structure of their chatbot flows.  
The editor is easier to use due to the drag and drop functionality and can be used by non-technical users to organise conversations visually, not in spreadsheets.

# Constraints Followed

- No React Flow
- No jsPlumb
- No Mermaid.js
- No Bootstrap
- No Material UI
This product does not require to use any external graph libraries.

All node rendering, and all calculation of connectors, were done by hand: using DOM coordinates and SVG.

# Design System

## Node Cards

- Simple card layout
- Rounded corners
- Clean typography
- Draggable positioning

## Connectors

- SVG straight lines
- Dynamically calculated positions
The nodes will automatically redraw if they change locations.



# Project Structure

SupportFlow-Visual-Builder/
│
├── index.html
│
├── src/
│   ├── main.js
│   ├── graph.js
│   ├── editor.js
│   ├── preview.js
│   ├── store.js
│   ├── styles.css
│   └── flow_data.json
│
└── README.md

# Author

Gloire Gwiza