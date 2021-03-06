import React from 'react';
import { withRouter } from 'react-router-dom';
import Person from '../people/person';
import "./birthday.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Birthday extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      people: [],
      startDate: new Date((new Date()).getFullYear(), this.props.match.params.month - 1, this.props.match.params.day)
    };
  }

  handleChange = date => {

    this.setState({
        startDate: date
    });

    this.props.history.push(
        `/birthdays/${date.getMonth()+1}/${date.getDate()}`
    );

  };

  componentWillMount() {
    this.props.fetchBirthday(
      this.props.match.params.month,
      this.props.match.params.day
    );
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.month !== this.props.match.params.month ||
      prevProps.match.params.day !== this.props.match.params.day
    ) {
      this.props.fetchBirthday(
        this.props.match.params.month,
        this.props.match.params.day
      );
    }
  }

  componentWillReceiveProps(newState) {
    this.setState({ people: newState.birthday });
  }

  render() {
    if (this.state.people.length === 0) {
      return <h1>Gathering birthdays...</h1>;
    } else {
      let today = new Date(Date.now());
      let currentYear = today.getFullYear();

      // Remove one year if the today is before the birthday
      if (
        today.getMonth() < this.props.match.params.month &&
        today.getDay() < this.props.match.params.day
      ) {
        currentYear -= 1;
      }

      return (
        <>
          <h1>
            The Birthday Database -
            {parseInt(this.props.match.params.month) ===
              parseInt(today.getMonth()) + 1 &&
            parseInt(this.props.match.params.day) === parseInt(today.getDate())
              ? " Happy " +
                this.props.match.params.month +
                "/" +
                this.props.match.params.day +
                "!"
              : " " +
                this.props.match.params.month +
                "/" +
                this.props.match.params.day}
          </h1>
          <DatePicker
            dateFormat="MMMM dd"
            selected={this.state.startDate}
            onChange={this.handleChange}
            withPortal
          />
          <div className="birthdayWrapper">
            {this.state.people.slice(0, 50).map(person => (
              <Person
                key={person._id}
                name={person.name}
                description={person.description}
                image={person.image}
                year={person.year}
                currentYear={currentYear}
              />
            ))}
          </div>
        </>
      );
    }
  }
}

export default withRouter(Birthday);