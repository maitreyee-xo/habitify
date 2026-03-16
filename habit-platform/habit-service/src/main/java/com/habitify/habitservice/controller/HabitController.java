package com.habitify.habitservice.controller;

import com.habitify.habitservice.dto.HabitRequest;
import com.habitify.habitservice.model.Habit;
import com.habitify.habitservice.service.HabitService;
import org.springframework.security.core.context.SecurityContextHolder;
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
            @RequestBody HabitRequest request
    ) {
        String username = currentUsername();
        return habitService.createHabit(username, request);
    }
    
@DeleteMapping("/{habitId}")
public void deleteHabit(
        @PathVariable Long habitId
) {
    String username = currentUsername();
    habitService.deleteHabit(habitId, username);
}

@GetMapping
public List<Habit> getUserHabits(
) {
    String username = currentUsername();
    System.out.println("CONTROLLER HIT, username=" + username);
    return habitService.getUserHabits(username);
}

    @PostMapping("/{habitId}/complete")
    public Habit completeHabit(
            @PathVariable Long habitId
    ) {
        String username = currentUsername();
        return habitService.markHabitCompleted(habitId, username);
    }

    private String currentUsername() {
        return (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }
}
