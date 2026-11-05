from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    roll_number = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True)
    role_title = Column(String(100), default="Student")
    department = Column(String(100), default="CSE")
    batch = Column(String(50), default="2023-2027")
    created_at = Column(DateTime, default=datetime.utcnow)

    projects = relationship("Project", back_populates="creator")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    domain = Column(String(100), nullable=False)
    problem_statement = Column(Text, nullable=True)
    objectives = Column(JSON, nullable=True)  # List of objectives
    abstract = Column(Text, nullable=True)
    methodology = Column(Text, nullable=True)
    tech_stack = Column(JSON, nullable=True)  # List of technologies
    novelty_score = Column(Float, default=85.0)
    novelty_analysis = Column(JSON, nullable=True)
    research_gaps = Column(JSON, nullable=True)
    retrieved_papers = Column(JSON, nullable=True)
    status = Column(String(50), default="In Ideation")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    creator = relationship("User", back_populates="projects")
    roadmap_tasks = relationship("RoadmapTask", back_populates="project", cascade="all, delete-orphan")
    viva_sessions = relationship("VivaSession", back_populates="project", cascade="all, delete-orphan")

class RoadmapTask(Base):
    __tablename__ = "roadmap_tasks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    week_number = Column(Integer, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    deliverable = Column(String(200), nullable=True)
    status = Column(String(50), default="pending")  # pending, in_progress, completed
    review_phase = Column(String(50), default="Phase 1 - Review 1")
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="roadmap_tasks")

class VivaSession(Base):
    __tablename__ = "viva_sessions"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    category = Column(String(100), default="Architecture")  # Conceptual, Architecture, Literature, Defense
    question = Column(Text, nullable=False)
    model_answer = Column(Text, nullable=True)
    student_answer = Column(Text, nullable=True)
    score = Column(Float, nullable=True)  # 0 to 10
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="viva_sessions")

class ReviewChecklistItem(Base):
    __tablename__ = "review_checklist_items"

    id = Column(Integer, primary_key=True, index=True)
    phase = Column(Integer, default=1)  # 1 to 6
    slide_number = Column(Integer, nullable=False)
    slide_title = Column(String(150), nullable=False)
    thesis_mapping = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
