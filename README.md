# TO-DO - General
* Professor can edit specific assignments

# Opt-Out? Do after everythign else is done? Future Work?
* Use item during assignment
* Add item/gold reward when creating assignment

# TO-DO - Back End
## Endpoints
### Register Post:
* Register Post:
* Send: { username: username, name: name, email: email, studentId: studentId, password: password, student: true }
* Recieve Ok: user object without password
* Recieve error: string message with error to show to user

### Login Post:
* Recieve Ok: user object without password

### GET: /user/profile
* Return page

### POST: /user/profile
* Send: { password: password }
* Recieve Ok: [nothing extra needed]
* Recieve error: [nothing extra needed]

### GET: /user/inventory
* Return page

### GET: /user/getInventory
* Send: User
* Recieve Ok: Item[] of items in that user's inventory
* Recieve error: [nothing extra needed]

### GET: /classes/classes
* Return page

### GET: /classes/getClasses
* Send: User
* Recieve Ok: If user == student Class[] of classes that student is in. If user != student Class[] of classes that professor teaches
* Recieve error: string message with error to show to user

### GET: /classes/class?userId=[id]&classId=[id]
* Return: If userId belongs to student classStudent.html, else classProfessor.html

### GET: /classes/assignment?classId=[id]&assignmentId=[id]
* Return page

### GET: /classes/assignmentQuestions
Send: { classId: classId, assignmentId: assignmentId }
Recieve ok: { assignmentName: "", assignmentDescription: "", questions: [{description: "", type: "", choice1: "", choice2: "", choice3: "", choice4: ""}, ...] } //If question type is fill-blank choice1, choice2, ... can be empty
Recieve error: [nothing extra needed]

### POST: /classes/submitAssignment
Send: { classId: classId, assignmentId: assignmentId, userId: userId, answers: [{type: "", answer: ""}, ...] } //type = fill-blank/mult-choice, answer if fill-blank == text, answer if mult-choice == choice #
Recieve ok: [nothing extra needed]
Recieve error: [nothing extra needed]

### Get: /classes/classInfoStudent
* Send: { classId: classId }
* Recieve Ok: Class object
* Recieve error: string message with error to show to user

### Get: /classes/classInfoProfessor
* Send: { classId: classId }
* Recieve Ok: { classInfo: [class object], items: [ Item[] of items associated to class ] }
* Recieve error: string message with error to show to user

### POST: /classes/update
* Send: { classId: classId, officeHours: officeHours }
* Recieve Ok: [nothing extra needed]
* Recieve error: [nothing extra needed]

### POST: /classes/addItem
* Send: (classId: classId, name: itemName, effect: itemEffect, sprite: sprite)
* Recieve Ok: [nothing extra needed]
* Recieve error: [nothing extra needed]

### POST: classes/addAssignment
* Send: { classId: classId, name: "", description: "", startDate: "". endDate: "", questions: questions}
* * questions = [{description: "", type: "", fillAnswer: "", correct_choice: "", choice1: "", choice2: "", choice3: "", choice4: ""}, ...]
* Recieve Ok: [nothing extra needed]
* Recieve error: [nothing extra needed]

### GET: classes/assignments
* Send: { classId: classId, userId: userId } 
* Recieve Ok: [{ assignmentId: assignmentId, classId: classId, name: "", description: "", startDate: "". endDate: "", hasTaken: true/false questions: questions}, ...] //only professors should be able to recieve questions of assignments, students still recieve everything else. hasTaken should be true if student has completed assignment
* Recieve error: [nothing extra needed]

### GET: classes/whoHasTaken
* Send: { classId: classId, assignmentId: assignmentId, userId: userId }
* Recieve Ok: [{ userId: userId, name: "", studentId: "", grade: "", itemEffect: "" }, ...] //Only if userId sent belongs to professor that owns class with classId sent
* Recieve error: [nothing extra needed]

### GET: classes/whatHasTaken
* Send: { classId: classId, userId: userId }
* Recieve Ok: [{ assignmentName: "", grade: "", itemEffect: "" }, ...] //List of assignments of classId user has taken
* Recieve error: [nothing extra needed]

### POST: classes/deleteAssignment
* Send: { classId: classId, assignmentId: assignmentId, userId: userId }
* Recieve ok: [nothing extra needed]
* Recieve error: [nothing extra needed]

## Objects:
* User: { [something] id, string username, string name string email, string studentId, string password, bool student, string office, int gold }
* Class: { [something] id, string name, User professor, string department, string code, string officeHours }
* Item: { [something] id, [something] classId, string className, string name, string effect, string sprite }