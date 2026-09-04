---
title: "CH32V305 Pico"
date: "2026-08-29"
summary: "A compact CH32V305RBT6 development board with a Raspberry Pi Pico-compatible form factor and USB High Speed."
url: "https://github.com/HelloWorldZTR/ch32v305-pico/tree/main"
---

## Overview

CH32V305 Pico is a compact development board built around the **CH32V305RBT6** RISC-V microcontroller. Its Raspberry Pi Pico-compatible dimensions and castellated holes make it easy to integrate into breadboards, carrier boards, and compact embedded projects.

![Assembled CH32V305 Pico development board](/photos/ch32v305-pico-board.jpg)

<small>Assembled CH32V305 Pico development board.</small>

## Hardware

The board supports **USB 2.0 High Speed** and provides ample GPIO and ADC resources. This makes it well suited to latency-sensitive devices such as keyboards with an **8 kHz polling rate**. All passive components are **0603 or larger** to keep the board practical for hand soldering.

![Close-up of the CH32V305RBT6 microcontroller and surrounding components](/photos/ch32v305-pico-mcu.jpg)

<small>CH32V305RBT6 microcontroller and supporting circuitry.</small>

![Three bare CH32V305 Pico printed circuit boards](/photos/ch32v305-pico-pcbs.jpg)

<small>Bare PCBs showing the Pico-style outline and castellated holes.</small>

## Firmware and examples

The repository includes a proven **CherryUSB USBHS port for CH32V30x**, together with configuration notes and MounRiver project setup. Ready-to-use examples demonstrate:

- a PA8 breathing LED driven by TIM1_CH1 hardware PWM;
- a USBHS mass-storage device backed by the final 8 KiB of internal flash.

[View the hardware files, firmware, documentation, and examples on GitHub](https://github.com/HelloWorldZTR/ch32v305-pico/tree/main).
