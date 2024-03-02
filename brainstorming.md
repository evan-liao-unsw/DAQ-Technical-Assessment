# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware
I followed the definition of the specification carefully but couldn't get the desired result. Then I tried different cases and found that using little endian and reversing the bitmask works. However, I don't have much experience dealing with endianness and bits, so there might be some misunderstandings of the concept, but I'm willing to dive into it at Redback and I can't wait to learn more of it.

## Telemetry
I've introduced a try-catch mechanism. This should manage any format inconsistencies coming from the data-emulator. If there’s an error, we'll know about it, but the server won't crash.
I've set a 5-second window to monitor temperature. If the temperature goes out of range more than three times in this window, it's printed to the console. I've also made sure that the timestamp printed is easy to understand.
The color now shifts based on temperature proximity to the limits. It's a gradient: green for safe zones and red when it's nearing unsafe levels.

## Cloud
I really dont have time doing this task.