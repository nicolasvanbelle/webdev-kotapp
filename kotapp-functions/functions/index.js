const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.planTasks = functions.https.onRequest((request, response) => {
    //get all the koten
    let koten = [];
    const kotenResult = firestore
        .firestore()
        .collection('/Koten')
        .get();

    //get all the users from all the koten
    let users = {};
    const usersResult = firestore
        .firestore()
        .collection('/Users')
        .get()

    usersResult.then(snap => {
        snap.forEach(doc => {
            let user = doc.data();
            if (user.kotId) {
                console.log(user);
                if (users[user.kotId] === undefined) {
                    users[user.kotId] = [];
                }
                users[user.kotId].push({ Name: user.Name, Uid: user.Uid });
            }
        })
    }).then(() => {
        kotenResult.then(snap => {
            snap.docs.forEach(doc => {
                console.log(doc.data());
                let kotId = doc.id;
                koten.push(doc.data())
                firestore
                    .firestore()
                    .collection('/Koten')
                    .doc('/' + doc.id)
                    .collection('/WeeklyTasks')
                    .get()
                    .then((snap) => {
                        snap.docs.forEach(doc => {
                            let weeklyTask = doc.data()

                            //plan the weekly task
                            let test = [weeklyTask.monday, weeklyTask.tuesday, weeklyTask.wednesday, weeklyTask.thursday, weeklyTask.friday]
                            test.forEach((day, index) => {
                                if (day) {
                                    let date = new Date();

                                    var next = new Date(date || new Date());
                                    next.setDate(next.getDate() + (index - next.getDay() + 7) % 7 + 1);

                                    if (day.length === 0) {
                                        firestore
                                            .firestore()
                                            .collection('/Koten')
                                            .doc(kotId)
                                            .collection('/PlannedTasks')
                                            .add({
                                                Name: weeklyTask.name,
                                                UserUid: users[kotId][Math.floor(Math.random() * users[kotId].length)].Uid,
                                                date: next
                                            })
                                    } else {
                                        firestore
                                            .firestore()
                                            .collection('/Koten')
                                            .doc(kotId)
                                            .collection('/PlannedTasks')
                                            .add({
                                                Name: weeklyTask.name,
                                                UserUid: day[Math.floor(Math.random() * day.length)],
                                                date: next
                                            })
                                    }
                                }
                            });
                        })
                    })
            })
        })
    })
    response.send("Tasks Planned");
});
