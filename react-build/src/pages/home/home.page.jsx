import React from 'react';
import { LoginRepo } from '../../components/login-popup/repo/login.repo';
import Dashboard from '../dashboard/dashboard.page';
import './home.page.scss';
import { Modal, Button, Input } from '@salilvnair/react-ui';

class Home extends React.Component {
  loginRepo = new LoginRepo();
  dashBoardRefs = [];
  state = {
    dashboardCourses: [],
    filterString: ''
  }

  setDashBoardRef = (ref) => {
    this.dashBoardRefs.push(ref);
  }

  addCoursesToHome = (courses) => {
    let existingDashboardCourses = this.state.dashboardCourses;
    let newDashboardCourses = existingDashboardCourses.concat(courses);
    this.setState({dashboardCourses:newDashboardCourses});
  }

  filterCourses = (e) => {
    let filterString = e.target.value;
    this.setState({filterString:filterString});
    const { dashboardCourses } = this.state;
    this.dashBoardRefs.forEach(dashboard => {
      dashboard.filteredCourses([]);
    })
    let filterDashboardRef = this.dashBoardRefs[0];
    let filteredCourses = dashboardCourses;
    if(filterString!='') {
      filteredCourses = this.state.dashboardCourses.filter(course=>{
        return course.author.toLowerCase().includes(filterString.toLowerCase())
                  || course.title.toLowerCase().includes(filterString.toLowerCase())
      })
    }
    filterDashboardRef.filteredCourses(filteredCourses);
  }

  resetFilter = () => {
    this.setState({filterString:''});
    this.dashBoardRefs.forEach(dashboard => {
      dashboard.resetFilter();
    })
  }

  render() {
    const { to, staticContext, ...rest } = this.props;
    let loggedInUsers = this.loginRepo.selectAllSync();
    return (
        <div {...rest} className="home">
          <div style={{
                    display:'flex',
                    justifyContent:'flex-end',
                    marginRight:'65px'}}>
            <Input
                    color="primary"
                    value={this.state.filterString}
                    onChange={(e) => this.filterCourses(e)}
                    label="Filter" />
            <Button style={{marginTop:'15px', marginLeft:'10px'}}
                type="raised"
                onClick={() => this.resetFilter()}
                color="warn">Clear</Button>
          </div>
          <div className="course-container">
              {
                loggedInUsers.length > 0 ?
                loggedInUsers.map(user => {
                  return (
                    <Dashboard key={user._id} currentUser={user} ref={this.setDashBoardRef} addCoursesToHome={this.addCoursesToHome} />
                  );
                })
                : <h1>Welcome to the Vdemy web!!!</h1>
              }
          </div>

        </div>
    );
  }
}

export default Home;
