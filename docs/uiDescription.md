# Online Examination System – UI & Screen Specification

## 1. Purpose of This Document

This document describes the **UI screens, page structure, and features** of the Online Examination System.

It is intended for:

* UI/UX designers
* Frontend developers
* Product planning and estimation

Focus:

* Clear screen separation
* User-friendly flow
* Exam safety and clarity

---

## 2. User Roles & UI Scope

### Roles

* **Admin (Super Admin)**
* **Candidate (Examinee)**

Each role has a **separate interface**.

---

## 3. Global UI Principles

* Clean, minimal layout
* High contrast for readability
* Clear call-to-action buttons
* No distractions during exams
* Responsive (Desktop-first, Mobile-friendly where applicable)

---

## 4. Candidate Interface (Examinee)

### 4.1 Public Pages

#### 4.1.1 Login Page

**Purpose**: Authenticate candidates

**Components**:

* Username / Email input
* Password input
* Login button
* Forgot password link

---

#### 4.1.2 Register Page (Optional)

**Purpose**: Allow candidates to self-register

**Components**:

* Full name
* Email
* Phone number
* Username
* Password / Confirm password
* Register button

---

### 4.2 Candidate Dashboard

#### 4.2.1 Exam List Page

**Purpose**: Show all available exams

**Components**:

* Exam card list

  * Exam name
  * Duration
  * Status badge (Not Started / Ongoing / Closed)
  * Start time
* Action button:

  * View details
  * Start exam (only when allowed)

---

#### 4.2.2 Exam Detail Page

**Purpose**: Display exam information before starting

**Components**:

* Exam title
* Description
* Total questions
* Duration
* Start & end time
* Rules / warnings
* Start Exam button

---

### 4.3 Exam Taking Interface (Core Screen)

#### 4.3.1 Exam Screen

**Purpose**: Main exam-taking UI

**Layout**:

* Top bar:

  * Exam title
  * Countdown timer (always visible)

* Main content:

  * Question text
  * Answer options (radio buttons)

* Sidebar (optional):

  * Question navigator (1, 2, 3...)
  * Answered / unanswered indicator

* Footer actions:

  * Previous / Next question
  * Submit exam button
  * Exit exam button

---

#### 4.3.2 Anti-Cheat UI Feedback

**Behavior**:

* Warning popup when tab is switched
* Fullscreen exit warning
* Violation counter display (optional)

---

### 4.4 Submit & Exit Flow

#### 4.4.1 Submit Confirmation Modal

**Purpose**: Prevent accidental submission

**Components**:

* Confirmation message
* Confirm submit button
* Cancel button

---

#### 4.4.2 Exit Exam Warning Modal

**Purpose**: Inform consequences of exiting

**Message**:

> If you exit the exam, your current answers will be submitted and you will not be able to re-enter.

---

### 4.5 Exam Result Page

**Purpose**: Display exam result (if allowed)

**Components**:

* Total score
* Correct / wrong count
* List of questions

  * Candidate answer
  * Correct answer
  * Status (Correct / Wrong)

---

## 5. Admin Interface (Super Admin)

### 5.1 Admin Login Page

**Components**:

* Username
* Password
* Login button

---

### 5.2 Admin Dashboard (Overview)

**Purpose**: System overview

**Widgets**:

* Total candidates
* Total exams
* Active exams
* Recent submissions

---

### 5.3 Candidate Management Pages

#### 5.3.1 Candidate List Page

**Components**:

* Search / filter
* Candidate table:

  * Name
  * Email
  * Phone
  * Status
* Actions:

  * View
  * Edit
  * Disable
  * Reset password

---

#### 5.3.2 Create / Edit Candidate Page

**Form Fields**:

* Full name
* Email
* Phone
* Username
* Password
* Status

---

### 5.4 Question Management Pages

#### 5.4.1 Question List Page

**Components**:

* Search / filter by tag
* Question preview
* Actions:

  * Edit
  * Delete

---

#### 5.4.2 Create / Edit Question Page

**Components**:

* Question editor (text / image)
* Options input (A, B, C, D)
* Correct answer selector
* Score per question
* Save button

---

### 5.5 Exam Management Pages

#### 5.5.1 Exam List Page

**Components**:

* Exam table

  * Name
  * Status
  * Start time
  * End time
* Actions:

  * Edit
  * Publish
  * Lock

---

#### 5.5.2 Create / Edit Exam Page

**Components**:

* Exam info form
* Question selection list
* Duration input
* Start / end datetime picker
* Publish toggle

---

### 5.6 Exam Results & Analytics

#### 5.6.1 Exam Result List Page

**Components**:

* Candidate list
* Score
* Status

---

#### 5.6.2 Candidate Exam Detail Page

**Components**:

* Candidate info
* Score summary
* Question-by-question analysis
* Violations count

---

## 6. Total Screen Count (Estimated)

### Candidate

* Login
* Register (optional)
* Exam list
* Exam detail
* Exam screen
* Result page

➡️ **6 screens**

### Admin

* Login
* Dashboard
* Candidate list
* Candidate form
* Question list
* Question form
* Exam list
* Exam form
* Result list
* Result detail

➡️ **10 screens**

---

## 7. Notes for Designers

* Exam screen must minimize distractions
* Timer must be extremely visible
* Use warning colors carefully (yellow / red)
* Avoid animations during exams

---

## 8. Summary

This UI specification provides a **clear screen map and feature list** for designing a professional, secure, and user-friendly online examination system.

This document can be handed directly to:

* UI/UX designers
* Frontend developers
* Product managers
