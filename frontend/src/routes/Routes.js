import { Route, Switch } from 'react-router-dom';

import Login from '../pages/Login';
import ManageAssignments from '../pages/ManageAssignments';
import SubjectsStudent from '../pages/SubjectsStudent';
import TeacherDashboard from '../pages/TeacherDashboard';
import ManageStudents from '../pages/ManageStudents';
import ManageModules from '../pages/ManageModules';
import Register from '../pages/Register';
import StudentSubjectAssignment from '../pages/StudentSubjectAssignment';
import ViewAssignment from '../pages/ViewAssignment';
import StudentDashboard from '../pages/StudentDashboard';
import GeneratedDiagrams from '../pages/GeneratedDiagrams';

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />

      <Route
        exact
        path="/auth/teacher/dashboard"
        component={TeacherDashboard}
      />
      <Route exact path="/auth/teacher/students" component={ManageStudents} />
      <Route exact path="/auth/teacher/modules" component={ManageModules} />
      <Route
        exact
        path="/auth/teacher/assignments"
        component={ManageAssignments}
      />
      <Route
        exact
        path="/auth/teacher/assignments/:id"
        component={ViewAssignment}
      />
      <Route
        exact
        path="/auth/teacher/assignments/:id/diagrams"
        component={GeneratedDiagrams}
      />

      <Route
        exact
        path="/auth/student/dashboard"
        component={StudentDashboard}
      />
      <Route exact path="/auth/student/modules" component={SubjectsStudent} />

      <Route
        exact
        path="/auth/student/assignment/:id"
        component={StudentSubjectAssignment}
      />
    </Switch>
  );
};

export default Routes;
