package com.habitify.habitservice.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Comes from auth-service JWT

    private String name;

    private String description;

    private boolean active = true;

    private LocalDate createdAt = LocalDate.now();

    private LocalDate lastCompletedDate;

    private int streakCount = 0;

    public Habit() {}

    public Habit(Long userId, String name, String description) {
        this.userId = userId;
        this.name = name;
        this.description = description;
    }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

    public LocalDate getLastCompletedDate() { return lastCompletedDate; }
    public void setLastCompletedDate(LocalDate lastCompletedDate) { this.lastCompletedDate = lastCompletedDate; }

    public int getStreakCount() { return streakCount; }
    public void setStreakCount(int streakCount) { this.streakCount = streakCount; }
}
