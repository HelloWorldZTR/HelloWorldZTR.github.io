---
title: "ProShock"
date: "2026"
summary: "A high-performance, 8 kHz gamepad controller board with native PS4 protocol support and app-free WebHID configuration."
url: "https://helloworldztr.github.io/proshock-config/#/home"
---

## Overview

ProShock is a high-performance gamepad controller board built around **USB 2.0 High-Speed at 480 Mbps**. It uses the native PS4 protocol and reaches a configurable polling rate of **512 Hz, 1 kHz, 2 kHz, 4 kHz, or 8 kHz**, while remaining fully compatible with PS4 controller shells and daughterboards.

![Assembled ProShock controller board with two analog stick modules](/photos/proshock-board.jpg)

<small>ProShock controller board fitted with two analog stick modules.</small>

## Configuration

- **4** on-device configuration slots
- Layered customization
- **8** programmable buttons
- Full button remapping
- Macro support and combo detection
- App-free configuration through WebHID

## Web configurator

The [ProShock Web Configurator](https://helloworldztr.github.io/proshock-config/#/home) provides a polished, highly detailed interface for every part of the controller. It runs directly in a compatible browser through WebHID, so there is no app to install.

Its live dashboard visualizes processed inputs, raw ADC readings, final HID values, trigger positions, and stick-roundness diagnostics in real time. All **4** configuration slots are visible at a glance.

[![ProShock Web Configurator live dashboard with controller input telemetry](/images/proshock-config-home.png)](https://helloworldztr.github.io/proshock-config/#/home)

<small>Live input monitoring, analog-pipeline diagnostics, and configuration-slot management. Click the image to open the configurator.</small>

The configurator also exposes precise controls for stick response curves, deadzones, triggers, buttons, lighting, advanced settings, calibration, and firmware upgrades while keeping the interface clear and visually consistent.

[![ProShock Web Configurator stick response curve editor](/images/proshock-config-sticks.png)](https://helloworldztr.github.io/proshock-config/#/home)

<small>Detailed radial-response editing with live processed-input previews and stick diagnostics.</small>

## Hardware and firmware

The board uses a high-precision, low-noise ADC for accurate analog input. Its firmware supports IAP (in-application programming), allowing users to update it online without replacing the controller hardware.

![Close-up of the ProShock microcontroller and surrounding components](/photos/proshock-mcu.jpg)

<small>Main processor, oscillator, and signal-routing detail.</small>

![ProShock PCB showing its routing, contacts, and configuration button](/photos/proshock-pcb.jpg)

<small>Custom PCB shaped for direct installation in a compatible PS4 controller shell.</small>
