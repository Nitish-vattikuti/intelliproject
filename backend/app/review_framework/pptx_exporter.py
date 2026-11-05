import io
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from typing import Dict, Any, List

# Academic Capstone Presentation Theme Colors (Dark Theme)
COLOR_BG = RGBColor(15, 23, 42)          # Deep Navy #0F172A
COLOR_CARD = RGBColor(30, 41, 59)        # Slate #1E293B
COLOR_WHITE = RGBColor(255, 255, 255)    # White
COLOR_TEXT_MUTED = RGBColor(148, 163, 184)# Muted Slate #94A3B8
COLOR_EMERALD = RGBColor(16, 185, 129)   # Emerald #10B981
COLOR_ACCENT = RGBColor(99, 102, 241)    # Indigo #6366F1
COLOR_CRIMSON = RGBColor(239, 68, 68)    # Crimson #EF4444
COLOR_GOLD = RGBColor(245, 158, 11)      # Gold #F59E0B

class PPTXExportEngine:
    """
    Exports publication-grade PowerPoint (.pptx) presentations for university capstone reviews.
    Dynamically renders slide decks for any user-provided engineering project.
    Strictly free from placeholder branding and simulated team rosters.
    """
    def __init__(self):
        pass

    def generate_review_1_pptx(self, deck_data: Dict[str, Any]) -> io.BytesIO:
        prs = Presentation()
        # Set 16:9 widescreen standard
        prs.slide_width = Inches(13.333)
        prs.slide_height = Inches(7.5)

        blank_layout = prs.slide_layouts[6]
        slides_data = deck_data.get("slides", [])

        for s_idx, slide_info in enumerate(slides_data):
            slide = prs.slides.add_slide(blank_layout)
            
            # 1. Background Fill
            bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
            bg.fill.solid()
            bg.fill.fore_color.rgb = COLOR_BG
            bg.line.fill.background()

            s_num = slide_info.get("slide_number", s_idx + 1)
            title = slide_info.get("title", f"Slide {s_num}")
            gate = slide_info.get("gate_label", "ACCEPTANCE GATE")
            thesis_mapping = slide_info.get("thesis_mapping", "Maps to Thesis")
            content = slide_info.get("content", {})

            # 2. Header Bar: Slide Number Pill + Title + Gate Badge
            self._render_header(slide, s_num, title, gate)

            # 3. Content Body
            if s_num == 1:
                self._render_title_slide(slide, content)
            elif s_num == 2:
                self._render_problem_statement(slide, content)
            elif s_num == 3:
                self._render_motivation_need(slide, content)
            elif s_num == 4:
                self._render_objectives(slide, content)
            elif s_num == 5:
                self._render_solution(slide, content)
            elif s_num == 6:
                self._render_scope(slide, content)
            elif s_num == 7:
                self._render_tech_stack(slide, content)
            elif s_num == 8:
                self._render_literature(slide, content)
            elif s_num == 9:
                self._render_timeline(slide, content)
            elif s_num == 10:
                self._render_team_roles(slide, content)
            else:
                self._render_generic_body(slide, title, content)

            # 4. Footer: Thesis Mapping
            self._render_footer(slide, s_num, len(slides_data), thesis_mapping)

        output_stream = io.BytesIO()
        prs.save(output_stream)
        output_stream.seek(0)
        return output_stream

    def _render_header(self, slide, s_num: int, title: str, gate: str):
        # Pill for slide number
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(0.6), Inches(0.4))
        pill.fill.solid()
        pill.fill.fore_color.rgb = COLOR_CARD
        pill.line.color.rgb = COLOR_ACCENT
        tf_pill = pill.text_frame
        tf_pill.text = f"{s_num:02d}"
        tf_pill.paragraphs[0].font.size = Pt(13)
        tf_pill.paragraphs[0].font.bold = True
        tf_pill.paragraphs[0].font.color.rgb = COLOR_ACCENT
        tf_pill.paragraphs[0].alignment = PP_ALIGN.CENTER

        # Title text
        tx_box = slide.shapes.add_textbox(Inches(1.6), Inches(0.45), Inches(8.5), Inches(0.6))
        tf = tx_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

        # Gate badge on top right
        gate_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.5), Inches(0.5), Inches(2.0), Inches(0.4))
        gate_box.fill.solid()
        gate_box.fill.fore_color.rgb = COLOR_CRIMSON
        gate_box.line.fill.background()
        tf_gate = gate_box.text_frame
        p_gate = tf_gate.paragraphs[0]
        p_gate.text = gate
        p_gate.font.size = Pt(10)
        p_gate.font.bold = True
        p_gate.font.color.rgb = COLOR_WHITE
        p_gate.alignment = PP_ALIGN.CENTER

    def _render_footer(self, slide, s_num: int, total_slides: int, thesis_mapping: str):
        # Line divider
        divider = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.7), Inches(11.733), Inches(0.02))
        divider.fill.solid()
        divider.fill.fore_color.rgb = COLOR_CARD
        divider.line.fill.background()

        # Thesis mapping text box
        tx_box = slide.shapes.add_textbox(Inches(0.8), Inches(6.8), Inches(8.0), Inches(0.4))
        tf = tx_box.text_frame
        p = tf.paragraphs[0]
        p.text = f"MAPS TO THESIS: {thesis_mapping}"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = COLOR_EMERALD

        # Slide count on bottom right
        tx_count = slide.shapes.add_textbox(Inches(10.5), Inches(6.8), Inches(2.0), Inches(0.4))
        tf_c = tx_count.text_frame
        p_c = tf_c.paragraphs[0]
        p_c.text = f"{s_num} / {total_slides}  |  Capstone Review"
        p_c.font.size = Pt(10)
        p_c.font.color.rgb = COLOR_TEXT_MUTED
        p_c.alignment = PP_ALIGN.RIGHT

    def _render_title_slide(self, slide, content: Dict[str, Any]):
        title = content.get("project_title", "Engineering Capstone Project")
        domain = content.get("domain", "Computer Science & Engineering")

        # Main Title Box
        tx_box = slide.shapes.add_textbox(Inches(1.0), Inches(1.4), Inches(11.3), Inches(1.3))
        tf = tx_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(26)
        p.font.bold = True
        p.font.color.rgb = COLOR_ACCENT

        # Subtitle
        p2 = tf.add_paragraph()
        p2.text = f"Area of Research: {domain}  |  Undergraduate Engineering Capstone"
        p2.font.size = Pt(14)
        p2.font.color.rgb = COLOR_TEXT_MUTED

        # Left Card: Project Specifications / Overview
        left_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(2.9), Inches(6.2), Inches(3.5))
        left_card.fill.solid()
        left_card.fill.fore_color.rgb = COLOR_CARD
        left_card.line.color.rgb = COLOR_CARD
        tf_l = left_card.text_frame
        tf_l.word_wrap = True
        p_lh = tf_l.paragraphs[0]
        p_lh.text = "PROJECT SPECIFICATIONS & SCOPE:"
        p_lh.font.size = Pt(13)
        p_lh.font.bold = True
        p_lh.font.color.rgb = COLOR_EMERALD

        bullets = content.get("overview_bullets", [
            f"Domain: {domain}",
            "Framework: Modular Multi-Tiered Architecture",
            "Evaluation Track: University Capstone Review"
        ])
        for b in bullets:
            pm = tf_l.add_paragraph()
            pm.text = f"• {b}"
            pm.font.size = Pt(12)
            pm.font.color.rgb = COLOR_WHITE

        # Right Card: Academic Affiliation & Review Details
        right_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.5), Inches(2.9), Inches(4.8), Inches(3.5))
        right_card.fill.solid()
        right_card.fill.fore_color.rgb = COLOR_CARD
        right_card.line.color.rgb = COLOR_CARD
        tf_r = right_card.text_frame
        tf_r.word_wrap = True
        p_rh = tf_r.paragraphs[0]
        p_rh.text = "EVALUATION & MILESTONE DETAILS:"
        p_rh.font.size = Pt(13)
        p_rh.font.bold = True
        p_rh.font.color.rgb = COLOR_GOLD

        pg = tf_r.add_paragraph()
        pg.text = f"\nFaculty Guide / Advisor:\n{content.get('guide_name', 'Faculty Project Advisor')}"
        pg.font.size = Pt(12)
        pg.font.bold = True
        pg.font.color.rgb = COLOR_WHITE

        pd = tf_r.add_paragraph()
        pd.text = f"\nDepartment:\n{content.get('department', 'Department of Computer Science & Engineering')}"
        pd.font.size = Pt(11)
        pd.font.color.rgb = COLOR_TEXT_MUTED

        pdt = tf_r.add_paragraph()
        review_date = content.get('date', 'Phase 1 Review 1')
        pdt.text = f"\nMilestone Stage: {review_date}"
        pdt.font.size = Pt(11)
        pdt.font.color.rgb = COLOR_ACCENT

    def _render_problem_statement(self, slide, content: Dict[str, Any]):
        # Left: Problem Box
        p_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.4), Inches(5.4), Inches(4.8))
        p_box.fill.solid()
        p_box.fill.fore_color.rgb = COLOR_CARD
        p_box.line.color.rgb = COLOR_CRIMSON
        tf_p = p_box.text_frame
        tf_p.word_wrap = True
        p_head = tf_p.paragraphs[0]
        p_head.text = "CHALLENGES & PROBLEM DEFINITION"
        p_head.font.size = Pt(14)
        p_head.font.bold = True
        p_head.font.color.rgb = COLOR_CRIMSON

        p_body = tf_p.add_paragraph()
        p_body.text = f"\n{content.get('problem_description', '')}"
        p_body.font.size = Pt(12)
        p_body.font.color.rgb = COLOR_WHITE

        # Right: Proposed Solution Box
        s_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.4), Inches(5.5), Inches(4.8))
        s_box.fill.solid()
        s_box.fill.fore_color.rgb = COLOR_CARD
        s_box.line.color.rgb = COLOR_EMERALD
        tf_s = s_box.text_frame
        tf_s.word_wrap = True
        s_head = tf_s.paragraphs[0]
        s_head.text = "PROPOSED SYSTEM SOLUTION"
        s_head.font.size = Pt(14)
        s_head.font.bold = True
        s_head.font.color.rgb = COLOR_EMERALD

        s_body = tf_s.add_paragraph()
        s_body.text = f"\n{content.get('solution_statement', '')}"
        s_body.font.size = Pt(12)
        s_body.font.color.rgb = COLOR_WHITE

    def _render_motivation_need(self, slide, content: Dict[str, Any]):
        # Left Card: Motivation
        m_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.4), Inches(5.4), Inches(4.8))
        m_box.fill.solid()
        m_box.fill.fore_color.rgb = COLOR_CARD
        m_box.line.color.rgb = COLOR_ACCENT
        tf_m = m_box.text_frame
        tf_m.word_wrap = True
        p_m = tf_m.paragraphs[0]
        p_m.text = "ACADEMIC MOTIVATION:"
        p_m.font.size = Pt(14)
        p_m.font.bold = True
        p_m.font.color.rgb = COLOR_ACCENT

        for pt in content.get("motivation_points", []):
            p = tf_m.add_paragraph()
            p.text = f"\n• {pt}"
            p.font.size = Pt(12)
            p.font.color.rgb = COLOR_WHITE

        # Right Card: Practical Need
        n_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.4), Inches(5.5), Inches(4.8))
        n_box.fill.solid()
        n_box.fill.fore_color.rgb = COLOR_CARD
        n_box.line.color.rgb = COLOR_GOLD
        tf_n = n_box.text_frame
        tf_n.word_wrap = True
        p_n = tf_n.paragraphs[0]
        p_n.text = "SYSTEMIC & INDUSTRIAL NEED:"
        p_n.font.size = Pt(14)
        p_n.font.bold = True
        p_n.font.color.rgb = COLOR_GOLD

        for pt in content.get("need_points", []):
            p = tf_n.add_paragraph()
            p.text = f"\n• {pt}"
            p.font.size = Pt(12)
            p.font.color.rgb = COLOR_WHITE

    def _render_objectives(self, slide, content: Dict[str, Any]):
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.4), Inches(11.333), Inches(4.8))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = COLOR_EMERALD
        tf = box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "MEASURABLE PROJECT OBJECTIVES:"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = COLOR_EMERALD

        for idx, obj in enumerate(content.get("objectives_list", []), 1):
            po = tf.add_paragraph()
            po.text = f"\n{idx:02d}. {obj}"
            po.font.size = Pt(12)
            po.font.color.rgb = COLOR_WHITE

    def _render_solution(self, slide, content: Dict[str, Any]):
        # Top summary
        top_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.4), Inches(11.333), Inches(1.3))
        top_box.fill.solid()
        top_box.fill.fore_color.rgb = COLOR_CARD
        top_box.line.color.rgb = COLOR_ACCENT
        tf_t = top_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = "ARCHITECTURE OVERVIEW & HIGH-LEVEL DESIGN:"
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_ACCENT
        p_b = tf_t.add_paragraph()
        p_b.text = content.get("architecture_summary", "")
        p_b.font.size = Pt(11)
        p_b.font.color.rgb = COLOR_WHITE

        # 4 Stage cards
        stages = content.get("pipeline_stages", [])
        w = Inches(2.65)
        for idx, st in enumerate(stages[:4]):
            x = Inches(1.0) + idx * Inches(2.88)
            card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(3.0), w, Inches(3.2))
            card.fill.solid()
            card.fill.fore_color.rgb = COLOR_CARD
            card.line.color.rgb = COLOR_EMERALD
            tf_c = card.text_frame
            tf_c.word_wrap = True
            pc = tf_c.paragraphs[0]
            pc.text = st.get("stage", f"STAGE {idx+1}")
            pc.font.size = Pt(11)
            pc.font.bold = True
            pc.font.color.rgb = COLOR_EMERALD
            pd = tf_c.add_paragraph()
            pd.text = f"\n{st.get('desc', '')}"
            pd.font.size = Pt(11)
            pd.font.color.rgb = COLOR_WHITE

    def _render_scope(self, slide, content: Dict[str, Any]):
        in_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.4), Inches(5.4), Inches(4.8))
        in_box.fill.solid()
        in_box.fill.fore_color.rgb = COLOR_CARD
        in_box.line.color.rgb = COLOR_EMERALD
        tf_in = in_box.text_frame
        tf_in.word_wrap = True
        p_in = tf_in.paragraphs[0]
        p_in.text = "IN-SCOPE DELIVERABLES:"
        p_in.font.size = Pt(14)
        p_in.font.bold = True
        p_in.font.color.rgb = COLOR_EMERALD
        for item in content.get("in_scope", []):
            pi = tf_in.add_paragraph()
            pi.text = f"\n✓ {item}"
            pi.font.size = Pt(11)
            pi.font.color.rgb = COLOR_WHITE

        out_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.4), Inches(5.5), Inches(4.8))
        out_box.fill.solid()
        out_box.fill.fore_color.rgb = COLOR_CARD
        out_box.line.color.rgb = COLOR_CRIMSON
        tf_out = out_box.text_frame
        tf_out.word_wrap = True
        p_out = tf_out.paragraphs[0]
        p_out.text = "OUT-OF-SCOPE BOUNDARIES:"
        p_out.font.size = Pt(14)
        p_out.font.bold = True
        p_out.font.color.rgb = COLOR_CRIMSON
        for item in content.get("out_scope", []):
            po = tf_out.add_paragraph()
            po.text = f"\n✕ {item}"
            po.font.size = Pt(11)
            po.font.color.rgb = COLOR_WHITE

    def _render_tech_stack(self, slide, content: Dict[str, Any]):
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.4), Inches(11.333), Inches(4.8))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = COLOR_ACCENT
        tf = box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "PROPOSED SYSTEM ARCHITECTURE & TECH STACK SELECTION:"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = COLOR_ACCENT

        for k, v in content.items():
            pt = tf.add_paragraph()
            clean_key = k.replace("_", " ").title()
            pt.text = f"• {clean_key}: {v}"
            pt.font.size = Pt(12)
            pt.font.color.rgb = COLOR_WHITE

    def _render_literature(self, slide, content: Dict[str, Any]):
        rows = content.get("table_rows", [])
        x, y, cx, cy = Inches(1.0), Inches(1.4), Inches(11.333), Inches(4.8)
        table_shape = slide.shapes.add_table(rows=len(rows) + 1, cols=4, left=x, top=y, width=cx, height=cy)
        table = table_shape.table

        table.columns[0].width = Inches(3.2)
        table.columns[1].width = Inches(2.6)
        table.columns[2].width = Inches(3.5)
        table.columns[3].width = Inches(2.0)

        headers = ["Research Work", "Approach", "Limitation", "Citation Link"]
        for c_idx, h in enumerate(headers):
            cell = table.cell(0, c_idx)
            cell.text = h
            cell.fill.solid()
            cell.fill.fore_color.rgb = COLOR_CARD
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(11)
            p.font.bold = True
            p.font.color.rgb = COLOR_EMERALD

        for r_idx, r in enumerate(rows):
            cell_0 = table.cell(r_idx + 1, 0)
            cell_0.text = r.get("work", "")
            cell_1 = table.cell(r_idx + 1, 1)
            cell_1.text = r.get("approach", "")
            cell_2 = table.cell(r_idx + 1, 2)
            cell_2.text = r.get("limitation", "")
            cell_3 = table.cell(r_idx + 1, 3)
            cell_3.text = r.get("citation", "").split("/")[-1]

            for c in [cell_0, cell_1, cell_2, cell_3]:
                c.fill.solid()
                c.fill.fore_color.rgb = COLOR_CARD
                if c.text_frame.paragraphs:
                    c.text_frame.paragraphs[0].font.size = Pt(10)
                    c.text_frame.paragraphs[0].font.color.rgb = COLOR_WHITE

    def _render_timeline(self, slide, content: Dict[str, Any]):
        phases = content.get("timeline_phases", [])
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.4), Inches(11.333), Inches(4.8))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = COLOR_GOLD
        tf = box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "MILESTONE PROJECT TIMELINE & GANTT PHASES:"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = COLOR_GOLD

        for ph in phases:
            pp = tf.add_paragraph()
            pp.text = f"\n• {ph.get('phase', '')} ({ph.get('months', '')})\n   Tasks: {ph.get('tasks', '')}"
            pp.font.size = Pt(11)
            pp.font.color.rgb = COLOR_WHITE

    def _render_team_roles(self, slide, content: Dict[str, Any]):
        modules = content.get("team_assignments", [])
        chapters = content.get("report_chapters", [])

        # Left: Modules Card
        m_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.4), Inches(5.4), Inches(4.8))
        m_box.fill.solid()
        m_box.fill.fore_color.rgb = COLOR_CARD
        m_box.line.color.rgb = COLOR_EMERALD
        tf_m = m_box.text_frame
        tf_m.word_wrap = True
        pm_h = tf_m.paragraphs[0]
        pm_h.text = "CORE FUNCTIONAL MODULES:"
        pm_h.font.size = Pt(13)
        pm_h.font.bold = True
        pm_h.font.color.rgb = COLOR_EMERALD

        for m in modules:
            pm = tf_m.add_paragraph()
            pm.text = f"\n• {m.get('name', '')}\n   {m.get('role', '')}"
            pm.font.size = Pt(11)
            pm.font.color.rgb = COLOR_WHITE

        # Right: Report Chapters Card
        r_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.4), Inches(5.5), Inches(4.8))
        r_box.fill.solid()
        r_box.fill.fore_color.rgb = COLOR_CARD
        r_box.line.color.rgb = COLOR_ACCENT
        tf_r = r_box.text_frame
        tf_r.word_wrap = True
        pr_h = tf_r.paragraphs[0]
        pr_h.text = "THESIS CHAPTER MAPPING:"
        pr_h.font.size = Pt(13)
        pr_h.font.bold = True
        pr_h.font.color.rgb = COLOR_ACCENT

        for ch in chapters:
            pr = tf_r.add_paragraph()
            pr.text = f"\n• {ch.get('chapter', '')}\n   {ch.get('focus', '')}"
            pr.font.size = Pt(11)
            pr.font.color.rgb = COLOR_WHITE

    def _render_generic_body(self, slide, title: str, content: Dict[str, Any]):
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.4), Inches(11.333), Inches(4.8))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = COLOR_ACCENT
        tf = box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"{title.upper()}:"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = COLOR_ACCENT

        for k, v in content.items():
            pv = tf.add_paragraph()
            clean_k = k.replace("_", " ").title()
            if isinstance(v, list):
                pv.text = f"\n• {clean_k}:"
                for item in v:
                    pi = tf.add_paragraph()
                    pi.text = f"   - {item}"
                    pi.font.size = Pt(11)
                    pi.font.color.rgb = COLOR_WHITE
            elif isinstance(v, dict):
                pv.text = f"\n• {clean_k}: {v}"
                pv.font.size = Pt(11)
                pv.font.color.rgb = COLOR_WHITE
            else:
                pv.text = f"\n• {clean_k}: {v}"
                pv.font.size = Pt(11)
                pv.font.color.rgb = COLOR_WHITE

pptx_exporter = PPTXExportEngine()
