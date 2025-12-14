package com.habitify.habitservice.service;

import com.habitify.habitservice.dto.HabitRequest;
import com.habitify.habitservice.model.Habit;
import com.habitify.habitservice.repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HabitService {

    private final HabitRepository habitRepository;

    public HabitService(HabitRepository habitRepository) {
        this.habitRepository = habitRepository;
    }

    public Habit createHabit(Long userId, HabitRequest request) {
        Habit habit = new Habit(userId, request.getName(), request.getDescription());
        return habitRepository.save(habit);
    }

    public List<Habit> getUserHabits(Long userId) {
        return habitRepository.findByUserId(userId);
    }

    public Habit markHabitCompleted(Long habitId, Long userId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUserId().equals(userId)) {
            throw new RuntimeException("Not allowed");
        }

        // streak logic
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        if (habit.getLastCompletedDate() == null) {
            habit.setStreakCount(1);
        } 
        else if (habit.getLastCompletedDate().equals(yesterday)) {
            habit.setStreakCount(habit.getStreakCount() + 1);
        } 
        else if (habit.getLastCompletedDate().equals(today)) {
            // already marked today
        } 
        else {
            habit.setStreakCount(1);
        }

        habit.setLastCompletedDate(today);

        return habitRepository.save(habit);
    }
}
