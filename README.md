Noise Deleter

ECE 499 Capstone | Group 17 | University of Victoria | 2026

The Noise Deleter is an adaptive active noise cancellation (ANC) system that reduces unwanted sound at a specific listening position in open air. Instead of headphones or sound barriers, it uses an eight-speaker phased array to generate anti-noise in real time using the FxLMS algorithm on custom hardware.

Motivation

Noise pollution affects people with sensory processing conditions and can cause permanent hearing damage in industrial environments. Passive barriers are ineffective at low frequencies, headphones only protect one person, and existing spatial ANC systems are expensive and complex. The Noise Deleter provides a compact, low-cost solution that operates on less than 10 W.

How It Works
A reference microphone measures incoming noise.
The controller generates an opposite-phase signal and directs it toward the listener using an eight-speaker array.
An error microphone measures the remaining sound.
The FxLMS algorithm updates the output in real time at 48 kHz to minimize the residual noise. If the system becomes unstable, it automatically resets.
System Design
Subsystem	Details
Speaker Array	8× Dayton Audio CE32A-4 (32 mm) drivers with 4.3 cm spacing
DSP	FxLMS adaptive filtering, I²S audio, TDM speaker output, instability detection
Electronics	Custom PCB with microcontroller, power supply, Class-D amplifiers, and MEMS microphone inputs
Enclosure	Custom CAD-designed, 3D-printed housing with microphone mount
Power	Under 10 W

Design Target: 15 dB noise reduction at 2 kHz.

Results

Completed

Peripheral interfacing verified
Single-tone active noise cancellation demonstrated
Predictable tone sequence partially completed
Broadband cancellation identified as future work

Validation
Ten bench tests covering amplifier communication, channel mapping, microphone operation, TDM output, audio loopback, power rails, FxLMS convergence, and fault recovery all passed. The 15 dB reduction target was partially achieved.

Team
Member	Role
Sophie Gander	Project Manager, hardware integration, PCB testing
Karnika Sitolay	Integration Lead, TDM output, system integration
Benjamin Blake	Software Lead, FxLMS algorithm and DSP
Nicholas Guildford	Hardware Lead, PCB design
Finn Berg	Physical Structure Lead, CAD design, 3D printing, speaker array

Supervisor: Dr. Peter Driessen

Acknowledgements: Niloofar Tavahoodi, Asif Ali, Dr. Michael McGuire, Dr. Sana Shuja, Brent Sirna, JLCPCB, the UVic ECE Department, and the UVic Formula Racing Team.
