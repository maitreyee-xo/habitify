package com.habitify.habitservice.service;

import com.habitify.habitservice.dto.HabitRequest;
import com.habitify.habitservice.model.Habit;
import com.habitify.habitservice.repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class HabitService {

    private final HabitRepository habitRepository;

    public HabitService(HabitRepository habitRepository) {
        this.habitRepository = habitRepository;
    }

public Habit createHabit(String username, HabitRequest request) {
    System.out.println("DEBUG: Entered HabitService.createHabit()");
    System.out.println("DEBUG: username = " + username);
    System.out.println("DEBUG: request.name = " + request.getName());
    System.out.println("DEBUG: request.description = " + request.getDescription());

    Habit habit = new Habit(username, request.getName(), request.getDescription());
    System.out.println("DEBUG: Habit constructed");

    habitRepository.save(habit);
    System.out.println("DEBUG: Habit saved");

    return habit;
}


public List<Habit> getUserHabits(String username) {
    System.out.println("SERVICE HIT, username=" + username);
    return habitRepository.findByUsername(username);
}

public void deleteHabit(Long habitId, String username) {
    Habit habit = habitRepository.findById(habitId)
            .orElseThrow(() -> new RuntimeException("Habit not found"));

    if (!habit.getUserId().equals(username)) {
        throw new RuntimeException("Unauthorized");
    }

    habitRepository.delete(habit);
}


public Habit markHabitCompleted(Long habitId, String username) {
    Habit habit = habitRepository.findById(habitId)
            .orElseThrow(() -> new RuntimeException("Habit not found"));

    if (!habit.getUserId().equals(username)) {
        throw new RuntimeException("Unauthorized");
    }

    LocalDate today = LocalDate.now();

    if (habit.getLastCompletedDate() == null ||
        habit.getLastCompletedDate().plusDays(1).equals(today)) {
        habit.setStreakCount(habit.getStreakCount() + 1);
    } else {
        habit.setStreakCount(1);
    }

    habit.setLastCompletedDate(today);
    return habitRepository.save(habit);
}

}