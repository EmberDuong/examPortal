# Online Examination System (Web-based)

## 1. Overview

This document describes the design of a **web-based online examination system** with two main roles:

* **Super Admin / Admin**
* **Candidate (Examinee)**

The system supports exam creation, scheduling, secure exam-taking, automatic scoring for multiple-choice questions, and detailed result analysis.

**Core goals**:

* Fair and time-controlled examinations
* Easy-to-use admin management
* Scalable and secure architecture
* Friendly UI/UX

---

## 2. User Roles & Permissions

### 2.1 Super Admin / Admin

Admins log in using a **super admin account** and have full control over the system.

**Permissions**:

* Manage candidates (CRUD)
* Manage questions (CRUD)
* Manage exams (CRUD)
* Control exam availability (open / lock)
* View and analyze scores
* Monitor candidate behavior during exams

---

### 2.2 Candidate (Examinee)

Candidates can register or be created by admin.

**Permissions**:

* Register / log in
* View available exams
* Take exams during allowed time
* Submit or exit exams
* View results (if allowed by admin)

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization

#### Admin

* Login via username + password
* Role-based access control (RBAC)
* JWT-based authentication

#### Candidate

* Register using email / phone / username / password
* Email verification (optional but recommended)
* Login with JWT session

---

## 4. Candidate Management (Admin)

Admin can:

* Create candidate accounts
* Update candidate information
* Reset passwords
* Disable / enable candidate accounts

**Candidate Information**:

* Full name
* Email
* Phone number
* Username
* Password (hashed)
* Status (active / banned)
* Created date

---

## 5. Question Management

### 5.1 Question Type

* Multiple-choice questions (MCQ)

### 5.2 Question Structure

* Question content (text / image optional)
* Options (A, B, C, D...)
* Correct answer(s)
* Score per question
* Difficulty level (optional)
* Tags / categories

### 5.3 Admin Capabilities

* Create questions
* Edit questions
* Delete questions
* Preview questions

---

## 6. Exam Management

### 6.1 Exam Structure

An exam consists of multiple questions.

**Exam Attributes**:

* Exam title
* Description
* Total duration (minutes)
* Start time (open time)
* End time (close time)
* Total score
* Status (draft / published / locked)

### 6.2 Exam Control

Admins can:

* Assign questions to an exam
* Set exam availability time
* Publish exam
* Lock exam manually (no one can open or continue)

---

## 7. Exam Flow (Candidate)

### 7.1 Viewing Exams

* After login, candidates see a list of exams
* Exams are visible only if **published**
* Exam status shown:

  * Not started
  * Ongoing
  * Closed

### 7.2 Starting an Exam

* Candidate clicks **Start Exam**
* System checks:

  * Current time is within allowed window
  * Candidate has not submitted before

Once started:

* Exam timer begins immediately
* Exam session is created

---

## 8. Timer & Auto-Submit Logic

* Countdown timer displayed on UI
* Timer is synced with server time
* When time reaches 0:

  * Exam is automatically submitted
  * Answers are locked

---

## 9. Anti-Cheating Mechanisms

### 9.1 Tab / Window Detection

* Detect `blur`, `visibilitychange` events
* Track number of times candidate leaves exam tab

### 9.2 Behavior Rules

* Admin-configurable rules:

  * Warning on first tab switch
  * Auto-submit after N violations

### 9.3 Fullscreen Mode (Optional)

* Force fullscreen during exam
* Detect exit from fullscreen

### 9.4 Server-side Validation

* All answers saved incrementally
* Final scoring happens on server only

---

## 10. Submit & Exit Exam

### 10.1 Submit Exam

* Candidate clicks **Submit**
* Confirmation dialog shown
* Answers are finalized

### 10.2 Exit Exam

* Candidate clicks **Exit Exam**

* Warning message:

  > Exiting will submit your current answers and you will not be able to re-enter.

* System submits exam automatically

* Candidate is blocked from re-accessing the exam

---

## 11. Scoring & Results

### 11.1 Auto Scoring

* MCQ questions are scored automatically
* Score = sum of correct answers

### 11.2 Result Data

* Total score
* Correct answers count
* Wrong answers count
* Unanswered questions

### 11.3 Admin Review

Admins can:

* View candidate scores
* See question-by-question results
* Analyze correct / incorrect answers

---

## 12. Database Design (MongoDB)

### 12.1 Collections

#### Users

* _id
* role (admin / candidate)
* name
* email
* phone
* username
* passwordHash
* status

#### Questions

* _id
* content
* options[]
* correctAnswer
* score
* tags[]

#### Exams

* _id
* title
* description
* questionIds[]
* duration
* startTime
* endTime
* status

#### ExamSessions

* _id
* examId
* candidateId
* answers[]
* startTime
* submitTime
* violationsCount
* score
* status

---

## 13. Technology Stack

### Backend

* Node.js
* TypeScript
* Express / Fastify
* MongoDB + Mongoose
* JWT Authentication

### Frontend

* React + TypeScript
* Modern UI (Material UI / Ant Design / Tailwind)
* Responsive design

### Security

* Password hashing (bcrypt)
* JWT + refresh token
* Rate limiting
* Input validation

---

## 14. UI/UX Principles

* Clean, minimal layout
* Clear exam timer visibility
* Large, readable questions
* Simple navigation
* Clear warnings and confirmations

---

## 15. Future Enhancements

* Question randomization
* Question pools
* Essay questions
* Proctoring with webcam (AI)
* Export results (Excel / PDF)
* Multi-language support

---

## 16. Summary

This system provides a **secure, scalable, and user-friendly online examination platform** using **TypeScript, MongoDB, and modern web technologies**, suitable for schools, companies, and training programs.

This document can be used as the foundation for:

* System architecture planning
* Database schema implementation
* API design
* UI/UX wireframing
