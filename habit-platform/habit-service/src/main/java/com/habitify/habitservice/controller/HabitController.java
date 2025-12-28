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
            @RequestAttribute("X-User-Id") String username,
            @RequestBody HabitRequest request
    ) {
        return habitService.createHabit(username, request);
    }
    
@DeleteMapping("/{habitId}")
public void deleteHabit(
        @RequestAttribute("X-User-Id") String username,
        @PathVariable Long habitId
) {
    habitService.deleteHabit(habitId, username);
}

@GetMapping
public List<Habit> getUserHabits(
        @RequestAttribute("X-User-Id") String username
) {
    System.out.println("CONTROLLER HIT, username=" + username);
    return habitService.getUserHabits(username);
}

    @PostMapping("/{habitId}/complete")
    public Habit completeHabit(
            @PathVariable Long habitId,
            @RequestAttribute("X-User-Id") String username
    ) {
        return habitService.markHabitCompleted(habitId, username);
    }
}
