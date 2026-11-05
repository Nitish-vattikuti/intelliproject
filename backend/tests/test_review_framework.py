import pytest
from app.review_framework.deck_builder import review_deck_builder
from app.review_framework.pptx_exporter import pptx_exporter
from app.review_framework.thesis_sync import thesis_sync_manager
from app.ml.novelty_engine import empirical_novelty_engine
from app.ml.evaluation_metrics import system_evaluator

def test_review_framework_metadata():
    meta = review_deck_builder.get_review_metadata()
    assert "Engineering" in meta["college"]
    assert "Computer Science" in meta["department"]
    assert len(meta["team_members"]) >= 4
    assert len(meta["reviews"]) == 7


def test_review_1_deck_generation():
    deck = review_deck_builder.build_review_1_deck()
    assert deck["total_slides"] == 10
    assert deck["slides"][0]["title"] == "Title Slide"
    assert deck["slides"][1]["title"] == "Problem Statement"
    assert deck["slides"][3]["title"] == "Project Objectives"
    assert "Ch 1 §1.2" in deck["slides"][1]["thesis_mapping"]

def test_pptx_generation():
    deck = review_deck_builder.build_review_1_deck()
    stream = pptx_exporter.generate_review_1_pptx(deck)
    assert stream is not None
    assert stream.getbuffer().nbytes > 10000  # Generated valid PPTX binary

def test_thesis_sync_drafts():
    drafts = thesis_sync_manager.generate_full_thesis_draft()
    assert "ch1" in drafts
    assert "ch2" in drafts
    assert "ch3" in drafts
    assert "Chapter 1: Introduction" in drafts["ch1"]

def test_empirical_novelty_calculation():
    res = empirical_novelty_engine.calculate_empirical_novelty(
        project_title="Autonomous Multi-Agent RAG with Knowledge Graph for Final Year Project Guidance",
        methodology="LangGraph state graph with ChromaDB dense retrieval"
    )
    assert "innovation_score" in res
    assert 70.0 <= res["innovation_score"] <= 98.0
    assert res["is_empirically_computed"] is True
