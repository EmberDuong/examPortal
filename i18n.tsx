
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Supported languages
export type Language = 'vi' | 'en';

// Translation keys type
type TranslationKey = keyof typeof translations.vi;

// Vietnamese translations (main language)
const vi = {
    // Common
    appName: 'ExamPortal',
    adminPanel: 'Bảng Quản Trị',
    examSystem: 'Hệ Thống Thi',
    signOut: 'Đăng Xuất',
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    edit: 'Sửa',
    add: 'Thêm',
    search: 'Tìm kiếm',
    filter: 'Lọc',
    export: 'Xuất',
    all: 'Tất cả',
    loading: 'Đang tải...',
    noData: 'Không có dữ liệu',
    confirm: 'Xác nhận',
    back: 'Quay lại',
    next: 'Tiếp theo',
    previous: 'Trước',
    submit: 'Nộp bài',
    close: 'Đóng',
    view: 'Xem',
    actions: 'Thao tác',
    status: 'Trạng thái',

    // Login Page
    loginTitle: 'Đăng Nhập Thí Sinh',
    adminLoginTitle: 'Truy Cập Quản Trị',
    loginDescription: 'Vui lòng nhập thông tin đăng nhập để truy cập cổng thi.',
    username: 'Tên đăng nhập',
    password: 'Mật khẩu',
    forgotPassword: 'Quên mật khẩu?',
    loginButton: 'Đăng Nhập',
    switchToAdmin: 'Chuyển sang Đăng nhập Quản trị',
    switchToCandidate: 'Chuyển sang Đăng nhập Thí sinh',
    demoCredentials: 'Thông tin đăng nhập demo',
    troubleLogging: 'Gặp vấn đề đăng nhập?',
    contactSupport: 'Liên hệ hỗ trợ',
    newCandidate: 'Thí sinh mới?',
    createAccount: 'Tạo tài khoản',
    invalidCredentials: 'Thông tin đăng nhập không hợp lệ',
    secureReliable: 'An Toàn & Đáng Tin Cậy',
    secureDescription: 'Nền tảng của chúng tôi đảm bảo trải nghiệm thi công bằng và suôn sẻ với bảo mật tiên tiến.',
    browserSecured: 'Trình duyệt được bảo mật',
    browserSecuredDesc: 'Môi trường được khóa để đảm bảo tính toàn vẹn của bài thi',

    // Dashboard
    myExams: 'Bài Thi Của Tôi',
    results: 'Kết Quả',
    profile: 'Hồ Sơ',
    welcomeBack: 'Chào mừng trở lại',
    pendingExams: 'bài thi đang chờ tuần này',
    allExams: 'Tất Cả Bài Thi',
    upcoming: 'Sắp Tới',
    ongoing: 'Đang Diễn Ra',
    completed: 'Đã Hoàn Thành',
    searchExams: 'Tìm kiếm bài thi theo tên hoặc môn học...',
    duration: 'Thời lượng',
    minutes: 'Phút',
    starts: 'Bắt đầu',
    ended: 'Đã kết thúc',
    resume: 'Tiếp tục',
    viewDetails: 'Xem Chi Tiết',
    viewResult: 'Xem Kết Quả',
    viewSyllabus: 'Xem Đề Cương',
    progress: 'Tiến độ',
    startExam: 'Bắt Đầu Thi',
    examNotFound: 'Không tìm thấy bài thi',
    openForAttempt: 'MỞ ĐỂ THI',
    instructionsAndRules: 'Hướng Dẫn & Quy Định',
    instruction1: 'Đảm bảo bạn ở trong phòng yên tĩnh với ánh sáng tốt. Bạn phải hiển thị trước camera trong suốt thời gian thi.',
    instruction2: 'Đây là bài kiểm tra có thời gian. Đồng hồ sẽ bắt đầu ngay khi bạn nhấn nút "Bắt Đầu Thi". Bài thi sẽ tự động nộp khi hết thời gian.',
    instruction3: 'Bạn có thể di chuyển giữa các câu hỏi bằng nút "Tiếp" và "Trước". Bạn cũng có thể đánh dấu câu hỏi để xem lại sau.',
    instruction4: 'Không làm mới trang hoặc sử dụng nút quay lại của trình duyệt. Làm vậy có thể khiến bạn mất tiến độ.',
    disqualificationWarning: 'Cảnh Báo Truất Quyền',
    disqualificationDesc: 'Việc chuyển tab trình duyệt hoặc thu nhỏ cửa sổ được giám sát. Hơn 3 vi phạm sẽ dẫn đến tự động nộp bài và có thể bị truất quyền.',
    schedule: 'Lịch Thi',
    date: 'Ngày',
    examWindow: 'Khung Giờ',
    systemCheck: 'Kiểm Tra Hệ Thống',
    webcam: 'Webcam',
    microphone: 'Microphone',
    internetSpeed: 'Tốc Độ Internet',
    runCheckAgain: 'Kiểm Tra Lại',
    agreeTerms: 'Tôi đã đọc và hiểu hướng dẫn. Tôi đồng ý với',
    termsOfService: 'Điều Khoản Dịch Vụ',
    totalMarks: 'Tổng Điểm',
    examCompleted: 'Bạn Đã Hoàn Thành Bài Thi Này',
    calendarView: 'Xem Lịch',

    // Exam Screen
    questionPalette: 'Bảng Câu Hỏi',
    answered: 'Đã Trả Lời',
    unanswered: 'Chưa Trả Lời',
    current: 'Hiện Tại',
    flagged: 'Đánh Dấu',
    flagForReview: 'Đánh dấu để xem lại',
    timeRemaining: 'Thời Gian Còn Lại',
    question: 'Câu hỏi',
    of: 'của',
    points: 'Điểm',
    answerSaved: 'Câu trả lời đã lưu',
    waitingInput: 'Đang chờ nhập liệu...',
    exitExam: 'Thoát Bài Thi',
    nextQuestion: 'Câu Tiếp Theo',
    finishExam: 'Hoàn Thành Bài Thi',

    // Exam Modals
    submitAssessment: 'Nộp Bài Thi?',
    submitDescription: 'Bạn sắp nộp bài thi. Vui lòng xác nhận đã trả lời tất cả câu hỏi. Bạn sẽ không thể thay đổi câu trả lời sau bước này.',
    confirmSubmit: 'Xác Nhận Nộp Bài',
    exitExamTitle: 'Thoát Bài Thi?',
    exitWarning: 'Nếu bạn thoát, các câu trả lời hiện tại sẽ được nộp và bạn sẽ không thể vào lại. Hành động này không thể hoàn tác.',
    continueExam: 'Tiếp Tục Làm Bài',
    exitAndSubmit: 'Thoát & Nộp Bài',

    // Anti-cheat
    tabSwitchDetected: 'Phát Hiện Chuyển Tab!',
    tabSwitchWarning: 'Bạn đã chuyển ra khỏi cửa sổ bài thi. Hoạt động này đã được ghi lại. Vui lòng tập trung vào bài thi để tránh cảnh báo thêm.',
    totalWarnings: 'Tổng số cảnh báo',
    understandContinue: 'Tôi Hiểu, Tiếp Tục Làm Bài',
    warnings: 'Cảnh báo',

    // Results
    resultsTitle: 'Kết Quả',
    submittedAt: 'Nộp lúc',
    autoSubmitted: 'Tự động nộp',
    backToDashboard: 'Quay lại Bảng Điều Khiển',
    totalScore: 'Tổng Điểm',
    passed: 'Đạt',
    failed: 'Không Đạt',
    timeTaken: 'Thời Gian Làm Bài',
    accuracy: 'Độ Chính Xác',
    correct: 'Đúng',
    wrong: 'Sai',
    questionReview: 'Xem Lại Câu Hỏi',
    yourAnswer: 'Câu Trả Lời Của Bạn',
    correctAnswer: 'Đáp Án Đúng',
    explanation: 'Giải thích',
    examIntegrityNotice: 'Thông Báo Tính Toàn Vẹn',
    violationsReceived: 'Bạn đã nhận được cảnh báo vì chuyển tab trong khi thi.',
    returnToDashboard: 'Quay Lại Bảng Điều Khiển',

    // Admin Dashboard
    dashboardOverview: 'Tổng Quan Bảng Điều Khiển',
    totalCandidates: 'Tổng Số Thí Sinh',
    totalExams: 'Tổng Số Bài Thi',
    questionBank: 'Ngân Hàng Câu Hỏi',
    activeNow: 'Đang Hoạt Động',
    liveExams: 'Bài thi trực tiếp',
    examActivity: 'Hoạt Động Thi',
    submissionsOverTime: 'Số bài nộp theo thời gian',
    quickActions: 'Thao Tác Nhanh',
    addCandidate: 'Thêm Thí Sinh',
    newExam: 'Bài Thi Mới',
    addQuestion: 'Thêm Câu Hỏi',
    viewResults: 'Xem Kết Quả',
    upcomingActiveExams: 'Bài Thi Sắp Tới & Đang Diễn Ra',
    viewAll: 'Xem Tất Cả',
    examTitle: 'Tên Bài Thi',
    department: 'Khoa/Bộ Môn',
    startDate: 'Ngày Bắt Đầu',
    questions: 'Câu Hỏi',

    // Sidebar Navigation
    dashboard: 'Bảng Điều Khiển',
    candidates: 'Thí Sinh',
    exams: 'Bài Thi',
    createNewExam: 'Tạo Bài Thi Mới',

    // Candidate Management
    candidateManagement: 'Quản Lý Thí Sinh',
    manageDescription: 'Quản lý thí sinh đã đăng ký và xử lý các thao tác tài khoản.',
    addNewCandidate: 'Thêm Thí Sinh Mới',
    searchCandidates: 'Tìm kiếm theo tên, email hoặc ID...',
    allStatus: 'Tất cả trạng thái',
    active: 'Hoạt động',
    pending: 'Chờ duyệt',
    disabled: 'Vô hiệu',
    candidate: 'Thí Sinh',
    contactInfo: 'Thông Tin Liên Hệ',
    resetPassword: 'Đặt Lại Mật Khẩu',
    fullName: 'Họ Tên',
    email: 'Email',
    phone: 'Số Điện Thoại',
    deleteCandidate: 'Xóa Thí Sinh?',
    deleteCandidateDesc: 'Hành động này không thể hoàn tác. Thí sinh và tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.',

    // Question Management
    questionManagement: 'Ngân Hàng Câu Hỏi',
    questionDescription: 'Tạo và quản lý câu hỏi thi.',
    addQuestionBtn: 'Thêm Câu Hỏi',
    searchQuestions: 'Tìm kiếm câu hỏi...',
    questionText: 'Nội Dung Câu Hỏi',
    description: 'Mô Tả',
    optionA: 'Đáp Án A',
    optionB: 'Đáp Án B',
    optionC: 'Đáp Án C',
    optionD: 'Đáp Án D',
    correctAnswerLabel: 'Đáp Án Đúng',
    pointsLabel: 'Điểm',
    explanationLabel: 'Giải Thích',
    createNewQuestion: 'Tạo Câu Hỏi Mới',
    editQuestion: 'Sửa Câu Hỏi',
    saveQuestion: 'Lưu Câu Hỏi',
    deleteQuestion: 'Xóa Câu Hỏi?',
    deleteQuestionDesc: 'Hành động này không thể hoàn tác. Câu hỏi sẽ bị xóa vĩnh viễn khỏi ngân hàng câu hỏi.',
    noQuestionsFound: 'Không tìm thấy câu hỏi',
    adjustSearchQuestion: 'Thử điều chỉnh tìm kiếm hoặc thêm câu hỏi mới',

    // Exam Management
    examManagement: 'Quản Lý Bài Thi',
    examManagementDesc: 'Tạo, lên lịch và quản lý bài thi.',
    createExam: 'Tạo Bài Thi',
    searchExamsAdmin: 'Tìm kiếm bài thi theo tên, mã hoặc khoa...',
    examCode: 'Mã Bài Thi',
    instructor: 'Giảng Viên',
    durationMins: 'Thời Lượng (phút)',
    passScore: 'Điểm Đạt (%)',
    selectQuestions: 'Chọn Câu Hỏi',
    selected: 'đã chọn',
    totalPoints: 'tổng điểm',
    draft: 'Nháp',
    scheduled: 'Đã Lên Lịch',
    closed: 'Đã Đóng',
    createNewExamTitle: 'Tạo Bài Thi Mới',
    editExam: 'Sửa Bài Thi',
    saveExam: 'Lưu Bài Thi',
    deleteExam: 'Xóa Bài Thi?',
    deleteExamDesc: 'Hành động này không thể hoàn tác. Bài thi và tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.',
    noExamsFound: 'Không tìm thấy bài thi',
    adjustSearchExam: 'Thử điều chỉnh tìm kiếm hoặc tạo bài thi mới',

    // Results Management
    resultsManagement: 'Kết Quả Thi',
    resultsDescription: 'Xem và phân tích bài nộp của thí sinh',
    exportCSV: 'Xuất CSV',
    totalSubmissions: 'Tổng Số Bài Nộp',
    passedCount: 'Số Đạt',
    avgScore: 'Điểm Trung Bình',
    searchStudents: 'Tìm kiếm theo tên hoặc email thí sinh...',
    allExamsFilter: 'Tất Cả Bài Thi',
    exam: 'Bài Thi',
    score: 'Điểm',
    submitted: 'Đã Nộp',
    resultDetails: 'Chi Tiết Kết Quả',
    candidateInfo: 'Thông Tin Thí Sinh',
    examInfo: 'Thông Tin Bài Thi',
    startedAt: 'Bắt Đầu Lúc',
    answersGiven: 'Câu Trả Lời Đã Chọn',
    violations: 'Vi Phạm',
    noResultsFound: 'Không tìm thấy kết quả',
    adjustSearchResults: 'Thử điều chỉnh tìm kiếm hoặc bộ lọc',

    // Language
    language: 'Ngôn ngữ',
    vietnamese: 'Tiếng Việt',
    english: 'English',

    // Registration & Phone Verification
    rememberMe: 'Ghi nhớ đăng nhập',
    noAccount: 'Chưa có tài khoản?',
    registerNow: 'Đăng ký ngay',
    registerTitle: 'Đăng Ký Tài Khoản',
    registerDescription: 'Điền thông tin để tạo tài khoản thí sinh mới.',
    confirmPassword: 'Xác Nhận Mật Khẩu',
    registerButton: 'Đăng Ký',
    haveAccount: 'Đã có tài khoản?',
    loginNow: 'Đăng nhập ngay',
    passwordMismatch: 'Mật khẩu không khớp',
    passwordTooShort: 'Mật khẩu phải có ít nhất 6 ký tự',
    phoneRequired: 'Số điện thoại là bắt buộc',
    registrationSuccess: 'Đăng ký thành công! Vui lòng xác thực số điện thoại.',
    verifyPhone: 'Xác Thực Số Điện Thoại',
    verifyPhoneDesc: 'Nhập mã 6 chữ số đã gửi đến số',
    verificationCode: 'Mã Xác Thực',
    verifyButton: 'Xác Thực',
    resendCode: 'Gửi lại mã',
    backToRegister: 'Quay lại đăng ký',
    verificationSuccess: 'Xác thực thành công! Đang chuyển hướng...',
    codeSent: 'Đã gửi mã xác thực mới',
    joinUs: 'Tham Gia Cùng Chúng Tôi',
    registerBenefit: 'Đăng ký để truy cập hệ thống thi trực tuyến chuyên nghiệp.',
    freeAccess: 'Truy cập miễn phí',
    secureExam: 'Thi an toàn',

    // Student Results Page
    myResults: 'Kết Quả Của Tôi',
    viewYourExamHistory: 'Xem lịch sử bài thi và điểm số của bạn',
    totalExamsTaken: 'Tổng Số Bài Thi',
    examsPassed: 'Số Bài Đạt',
    averageScore: 'Điểm Trung Bình',
    noResults: 'Chưa có kết quả nào',
    noResultsDesc: 'Bạn chưa hoàn thành bài thi nào',
    takeFirstExam: 'Làm Bài Thi Đầu Tiên',

    // Profile Page
    myProfile: 'Hồ Sơ Của Tôi',
    manageAccountSettings: 'Quản lý thông tin tài khoản của bạn',
    administrator: 'Quản trị viên',
    studentRole: 'Thí sinh',
    editProfile: 'Sửa Hồ Sơ',
    notProvided: 'Chưa cung cấp',
    studentId: 'Mã Thí Sinh',
    saveChanges: 'Lưu Thay Đổi',
    security: 'Bảo Mật',
    lastChanged: 'Thay đổi lần cuối',
    never: 'Chưa bao giờ',
    changePassword: 'Đổi Mật Khẩu',
    currentPassword: 'Mật Khẩu Hiện Tại',
    newPassword: 'Mật Khẩu Mới',
    dangerZone: 'Vùng Nguy Hiểm',
    deleteAccount: 'Xóa Tài Khoản',
    deleteAccountDesc: 'Xóa vĩnh viễn tài khoản và tất cả dữ liệu liên quan',
};

// English translations
const en: typeof vi = {
    // Common
    appName: 'ExamPortal',
    adminPanel: 'Admin Panel',
    examSystem: 'Exam System',
    signOut: 'Sign Out',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    all: 'All',
    loading: 'Loading...',
    noData: 'No data',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    close: 'Close',
    view: 'View',
    actions: 'Actions',
    status: 'Status',

    // Login Page
    loginTitle: 'Candidate Login',
    adminLoginTitle: 'Administrator Access',
    loginDescription: 'Please enter your credentials to access the examination portal.',
    username: 'Username',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    loginButton: 'Log In',
    switchToAdmin: 'Switch to Admin Login',
    switchToCandidate: 'Switch to Candidate Login',
    demoCredentials: 'Demo Credentials',
    troubleLogging: 'Trouble logging in?',
    contactSupport: 'Contact Support',
    newCandidate: 'New candidate?',
    createAccount: 'Create Account',
    invalidCredentials: 'Invalid credentials',
    secureReliable: 'Secure & Reliable Testing',
    secureDescription: 'Our platform ensures a fair and smooth examination experience with advanced security.',
    browserSecured: 'Browser Secured',
    browserSecuredDesc: 'Environment is locked for exam integrity',

    // Dashboard
    myExams: 'My Exams',
    results: 'Results',
    profile: 'Profile',
    welcomeBack: 'Welcome back',
    pendingExams: 'pending exams this week',
    allExams: 'All Exams',
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    completed: 'Completed',
    searchExams: 'Search exams by name or subject...',
    duration: 'Duration',
    minutes: 'Mins',
    starts: 'Starts',
    ended: 'Ended',
    resume: 'Resume',
    viewDetails: 'View Details',
    viewResult: 'View Result',
    viewSyllabus: 'View Syllabus',
    progress: 'Progress',
    startExam: 'Start Exam',
    examNotFound: 'Exam not found',
    openForAttempt: 'OPEN FOR ATTEMPT',
    instructionsAndRules: 'Instructions & Rules',
    instruction1: 'Ensure you are in a quiet room with good lighting. You must remain visible to the camera at all times during the exam.',
    instruction2: 'This is a timed assessment. The timer will start as soon as you click the "Start Exam" button. The exam will auto-submit when the time is up.',
    instruction3: 'You can navigate between questions using the "Next" and "Previous" buttons. You can also flag questions to review them later.',
    instruction4: 'Do not refresh the page or use the browser back button. Doing so may cause you to lose your progress.',
    disqualificationWarning: 'Disqualification Warning',
    disqualificationDesc: 'Switching browser tabs or minimizing the window is monitored. More than 3 violations will result in automatic submission and potential disqualification.',
    schedule: 'Schedule',
    date: 'Date',
    examWindow: 'Window',
    systemCheck: 'System Check',
    webcam: 'Webcam',
    microphone: 'Microphone',
    internetSpeed: 'Internet Speed',
    runCheckAgain: 'Run Check Again',
    agreeTerms: 'I have read and understood the instructions. I agree to the',
    termsOfService: 'Terms of Service',
    totalMarks: 'Total Marks',
    examCompleted: 'You Have Already Completed This Exam',
    calendarView: 'Calendar View',

    // Exam Screen
    questionPalette: 'Question Palette',
    answered: 'Answered',
    unanswered: 'Unanswered',
    current: 'Current',
    flagged: 'Flagged',
    flagForReview: 'Flag for Review',
    timeRemaining: 'Time Remaining',
    question: 'Question',
    of: 'of',
    points: 'Points',
    answerSaved: 'Answer saved',
    waitingInput: 'Waiting for input...',
    exitExam: 'Exit Exam',
    nextQuestion: 'Next Question',
    finishExam: 'Finish Exam',

    // Exam Modals
    submitAssessment: 'Submit Assessment?',
    submitDescription: 'You are about to submit your exam. Please verify that you have answered all questions. You will not be able to change your answers after this step.',
    confirmSubmit: 'Confirm Submit',
    exitExamTitle: 'Exit Exam?',
    exitWarning: 'If you exit the exam, your current answers will be submitted and you will not be able to re-enter. This action cannot be undone.',
    continueExam: 'Continue Exam',
    exitAndSubmit: 'Exit & Submit',

    // Anti-cheat
    tabSwitchDetected: 'Tab Switch Detected!',
    tabSwitchWarning: 'You have switched away from the exam window. This activity has been recorded. Please remain focused on the exam to avoid further warnings.',
    totalWarnings: 'Total Warnings',
    understandContinue: 'I Understand, Continue Exam',
    warnings: 'Warning(s)',

    // Results
    resultsTitle: 'Results',
    submittedAt: 'Submitted at',
    autoSubmitted: 'Auto-submitted',
    backToDashboard: 'Back to Dashboard',
    totalScore: 'Total Score',
    passed: 'Passed',
    failed: 'Failed',
    timeTaken: 'Time Taken',
    accuracy: 'Accuracy',
    correct: 'Correct',
    wrong: 'Wrong',
    questionReview: 'Question Review',
    yourAnswer: 'Your Answer',
    correctAnswer: 'Correct Answer',
    explanation: 'Explanation',
    examIntegrityNotice: 'Exam Integrity Notice',
    violationsReceived: 'You received warning(s) for switching tabs during the exam.',
    returnToDashboard: 'Return to Dashboard',

    // Admin Dashboard
    dashboardOverview: 'Dashboard Overview',
    totalCandidates: 'Total Candidates',
    totalExams: 'Total Exams',
    questionBank: 'Question Bank',
    activeNow: 'Active Now',
    liveExams: 'Live exams',
    examActivity: 'Exam Activity',
    submissionsOverTime: 'Submissions over time',
    quickActions: 'Quick Actions',
    addCandidate: 'Add Candidate',
    newExam: 'New Exam',
    addQuestion: 'Add Question',
    viewResults: 'View Results',
    upcomingActiveExams: 'Upcoming & Active Exams',
    viewAll: 'View All',
    examTitle: 'Exam Title',
    department: 'Department',
    startDate: 'Start Date',
    questions: 'Questions',

    // Sidebar Navigation
    dashboard: 'Dashboard',
    candidates: 'Candidates',
    exams: 'Exams',
    createNewExam: 'Create New Exam',

    // Candidate Management
    candidateManagement: 'Candidate Management',
    manageDescription: 'Manage registered candidates and handle account actions.',
    addNewCandidate: 'Add New Candidate',
    searchCandidates: 'Search by name, email, or ID...',
    allStatus: 'All Status',
    active: 'Active',
    pending: 'Pending',
    disabled: 'Disabled',
    candidate: 'Candidate',
    contactInfo: 'Contact Info',
    resetPassword: 'Reset Password',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    deleteCandidate: 'Delete Candidate?',
    deleteCandidateDesc: 'This action cannot be undone. The candidate and all associated data will be permanently removed.',

    // Question Management
    questionManagement: 'Question Bank',
    questionDescription: 'Create and manage exam questions.',
    addQuestionBtn: 'Add Question',
    searchQuestions: 'Search questions...',
    questionText: 'Question Text',
    description: 'Description',
    optionA: 'Option A',
    optionB: 'Option B',
    optionC: 'Option C',
    optionD: 'Option D',
    correctAnswerLabel: 'Correct Answer',
    pointsLabel: 'Points',
    explanationLabel: 'Explanation',
    createNewQuestion: 'Create New Question',
    editQuestion: 'Edit Question',
    saveQuestion: 'Save Question',
    deleteQuestion: 'Delete Question?',
    deleteQuestionDesc: 'This action cannot be undone. The question will be permanently removed from the question bank.',
    noQuestionsFound: 'No questions found',
    adjustSearchQuestion: 'Try adjusting your search or add a new question',

    // Exam Management
    examManagement: 'Exam Management',
    examManagementDesc: 'Create, schedule, and manage exams.',
    createExam: 'Create Exam',
    searchExamsAdmin: 'Search exams by name, code, or department...',
    examCode: 'Exam Code',
    instructor: 'Instructor',
    durationMins: 'Duration (minutes)',
    passScore: 'Pass Score (%)',
    selectQuestions: 'Select Questions',
    selected: 'selected',
    totalPoints: 'total points',
    draft: 'Draft',
    scheduled: 'Scheduled',
    closed: 'Closed',
    createNewExamTitle: 'Create New Exam',
    editExam: 'Edit Exam',
    saveExam: 'Save Exam',
    deleteExam: 'Delete Exam?',
    deleteExamDesc: 'This action cannot be undone. The exam and all associated data will be permanently removed.',
    noExamsFound: 'No exams found',
    adjustSearchExam: 'Try adjusting your search or create a new exam',

    // Results Management
    resultsManagement: 'Exam Results',
    resultsDescription: 'View and analyze candidate exam submissions',
    exportCSV: 'Export CSV',
    totalSubmissions: 'Total Submissions',
    passedCount: 'Passed',
    avgScore: 'Avg. Score',
    searchStudents: 'Search by student name or email...',
    allExamsFilter: 'All Exams',
    exam: 'Exam',
    score: 'Score',
    submitted: 'Submitted',
    resultDetails: 'Result Details',
    candidateInfo: 'Candidate Info',
    examInfo: 'Exam Information',
    startedAt: 'Started At',
    answersGiven: 'Answers Given',
    violations: 'Violations',
    noResultsFound: 'No results found',
    adjustSearchResults: 'Try adjusting your search or filter',

    // Language
    language: 'Language',
    vietnamese: 'Tiếng Việt',
    english: 'English',

    // Registration & Phone Verification
    rememberMe: 'Remember me',
    noAccount: 'Don\'t have an account?',
    registerNow: 'Register now',
    registerTitle: 'Create Account',
    registerDescription: 'Fill in your information to create a new candidate account.',
    confirmPassword: 'Confirm Password',
    registerButton: 'Register',
    haveAccount: 'Already have an account?',
    loginNow: 'Login now',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    phoneRequired: 'Phone number is required',
    registrationSuccess: 'Registration successful! Please verify your phone number.',
    verifyPhone: 'Verify Phone Number',
    verifyPhoneDesc: 'Enter the 6-digit code sent to',
    verificationCode: 'Verification Code',
    verifyButton: 'Verify',
    resendCode: 'Resend code',
    backToRegister: 'Back to register',
    verificationSuccess: 'Verification successful! Redirecting...',
    codeSent: 'New verification code sent',
    joinUs: 'Join Us',
    registerBenefit: 'Register to access the professional online examination system.',
    freeAccess: 'Free access',
    secureExam: 'Secure exams',

    // Student Results Page
    myResults: 'My Results',
    viewYourExamHistory: 'View your exam history and scores',
    totalExamsTaken: 'Total Exams Taken',
    examsPassed: 'Exams Passed',
    averageScore: 'Average Score',
    noResults: 'No results yet',
    noResultsDesc: 'You haven\'t completed any exams yet',
    takeFirstExam: 'Take Your First Exam',

    // Profile Page
    myProfile: 'My Profile',
    manageAccountSettings: 'Manage your account settings',
    administrator: 'Administrator',
    studentRole: 'Student',
    editProfile: 'Edit Profile',
    notProvided: 'Not provided',
    studentId: 'Student ID',
    saveChanges: 'Save Changes',
    security: 'Security',
    lastChanged: 'Last changed',
    never: 'Never',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    dangerZone: 'Danger Zone',
    deleteAccount: 'Delete Account',
    deleteAccountDesc: 'Permanently delete your account and all associated data',
};

export const translations = { vi, en };

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved as Language) || 'vi'; // Default to Vietnamese
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = (key: TranslationKey): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// Language Switcher Component
export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { language, setLanguage, t } = useLanguage();

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <span className="material-symbols-outlined text-lg text-slate-400">translate</span>
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm font-medium cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
                <option value="vi">🇻🇳 {t('vietnamese')}</option>
                <option value="en">🇬🇧 {t('english')}</option>
            </select>
        </div>
    );
};
