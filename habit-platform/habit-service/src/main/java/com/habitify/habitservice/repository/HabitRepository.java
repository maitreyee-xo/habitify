package com.habitify.habitservice.repository;

import com.habitify.habitservice.model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUsername(String username);
}