Noise Deleter
ECE 499 Capstone — Group 17 — University of Victoria — 2026

The Noise Deleter is an adaptive active noise cancellation (ANC) system that suppresses harmful noise at a defined listening position in open air. Instead of headphones or passive barriers, it uses an eight-driver phased speaker array to steer a beam of destructive interference at the listener, adapting in real time with the FxLMS algorithm on fully custom hardware.
Motivation:
Noise pollution in professional and care settings degrades quality of life for people with sensory processing conditions, and sustained exposure on construction and industrial sites causes irreversible hearing damage. Existing solutions leave a gap: passive barriers fail at low frequencies, consumer ANC headphones protect only one wearer, and laboratory spatial-ANC systems demand high channel counts and infrastructure. The Noise Deleter targets that middle ground — self-contained, built from commodity hardware, and under 10 W
How it works:
A reference microphone near the disturbance source measures the incoming noise.
The controller generates an anti-noise waveform (equal amplitude, opposite phase) and drives the eight-speaker array as a phased beam aimed at the listening position.
An error microphone at the listening position measures the residual sound.
The FxLMS algorithm updates one complex weight per speaker (8 total) every sample at 48 kHz, scaled by the measured secondary path, continuously driving the residual toward zero. A divergence detector mutes and resets the system if adaptation goes unstable.
System design:
Subsystem
Details
Speaker array
8× Dayton Audio CE32A-4 (32 mm) drivers, 4.3 cm spacing. At the 2 kHz design frequency the array spans ~1.5 wavelengths, giving a beam half-power width of ~34°.
DSP / firmware
FxLMS adaptive filtering at 48 kHz; I²S audio interfacing; TDM output to the amplifiers; divergence detection and recovery.
Electronics
Fully custom PCB (Noise Deleter v1): microcontroller, power supply (6–36 V in, 5 V and 3.3 V rails), Class-D amplifier channels, and MEMS microphone inputs on one board, with trace/via design to limit EMI between amplifier outputs and mic inputs.
Enclosure
Custom CAD-designed, 3D-printed enclosure housing the array, PCB, and wire routing, with a separate mount for the feedback microphone.
Power
Under 10 W total budget.


Design targets: 15 dB reduction at the listening position at 2 kHz.
Results
Milestones:

Peripheral interfacing — passed. Measured an input tone and played a matching tone, verifying I²S interfacing of all peripherals and basic DSP.
Single-tone cancellation — achieved. Demonstrated destructive waveform generation with measurable attenuation at the error microphone.
Predictable tone sequence — partial. Active waveform generation was demonstrated; work was constrained by testing time after PCB arrival.
Complex broadband cancellation — future work. Requires automatic frequency estimation and multi-tone tracking.

Validation testing: 10 bench tests covering amplifier communication, channel mapping, I²S microphone operation, TDM multi-speaker output, stereo mic addressing, full audio-pipeline loopback, PCB power rails, FxLMS convergence, and divergence recovery — all passed; the full 15 dB objective was partially met.

Team
Member
Role
Sophie Gander
Project Manager — hardware integration, speaker amplifier system, PCB bring-up and testing
Karnika Sitolay
Integration Lead — TDM output, system integration, parameter tuning
Benjamin Blake
Software Lead — FxLMS algorithm, I²S interface, DSP architecture
Nicholas Guildford
Hardware Lead — PCB design: microcontroller, power supply, amplifiers, microphones
Finn Berg
Physical Structure Lead — CAD design, 3D printing, speaker array mounting


Supervised by Dr. Peter Driessen, Dept. of Electrical & Computer Engineering, University of Victoria. Thanks to Niloofar Tavahoodi, Asif Ali, Dr. Michael McGuire and the ECE Department, Dr. Sana Shuja, Brent Sirna, JLC PCB, and the UVic Formula Racing Team.
