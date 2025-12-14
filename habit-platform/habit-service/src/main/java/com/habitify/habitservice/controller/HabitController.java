package com.habitify.habitservice.controller;

import com.habitify.habitservice.dto.HabitRequest;
import com.habitify.habitservice.model.Habit;
import com.habitify.habitservice.service.HabitService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/habits")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @PostMapping
    public Habit createHabit(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody HabitRequest request
    ) {
        return habitService.createHabit(userId, request);
    }

    @GetMapping
    public List<Habit> getUserHabits(@RequestHeader("X-User-Id") Long userId) {
        return habitService.getUserHabits(userId);
    }

    @PostMapping("/{habitId}/complete")
    public Habit completeHabit(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long habitId
    ) {
        return habitService.markHabitCompleted(habitId, userId);
    }
}
