// Imports
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter, Redirect } from "react-router-dom";

// UI Imports
import Card from "../../ui/card/Card";
import Button from "../../ui/button/Button";
import H4 from "../../ui/typography/H4";
import Icon from "../../ui/icon";
import { white, grey2, black } from "../../ui/common/colors";

// App Imports
import { APP_URL } from "../../setup/config/env";
import userRoutes from "../../setup/routes/user";
import { messageShow, messageHide } from "../common/api/actions";
import { create } from "../subscription/api/actions";

// Component - This is the component that displays when a user clicks subscribe on a crate
class Item extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  // need two separate functions
  // one should check for stylePreference
  // if there is no value for it, should do the logic that will redirect you
  // otherwise, should just do the regular subscribe option

  checkStyle = (crateId) => {
    console.log(this.props.stylePreference);
    if (this.props.stylePreference) {
      this.subscribe(crateId);
    } else {
      this.redirectToSurvey(crateId);
    }
  };

  redirectToSurvey = (crateId) => {
    this.props
      .create({ crateId })
      .then((response) => {
        if (response.data.errors && response.data.errors.length > 0) {
          console.log(response.data.errors[0].message);
        } else {
          this.props.history.push(userRoutes.style.path);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  subscribe = (crateId) => {
    this.setState({
      isLoading: true,
    });

    this.props.messageShow("Subscribing, please wait...");

    this.props
      .create({ crateId })
      .then((response) => {
        if (response.data.errors && response.data.errors.length > 0) {
          this.props.messageShow(response.data.errors[0].message);
        } else {
          this.props.messageShow("Subscribed successfully.");

          this.props.history.push(userRoutes.subscriptions.path);
        }
      })
      .catch((error) => {
        this.props.messageShow(
          "There was some error subscribing to this crate. Please try again."
        );
      })
      .then(() => {
        this.setState({
          isLoading: false,
        });

        window.setTimeout(() => {
          this.props.messageHide();
        }, 5000);
      });
  };

  render() {
    console.log(this.props);
    const { id, name, description } = this.props.crate;
    const { isLoading } = this.state;

    return (
      <Card style={{ width: "18em", backgroundColor: white }}>
        <p style={{ padding: "2em 3em 0 3em" }}>
          <img
            src={`${APP_URL}/images/crate.png`}
            alt={name}
            style={{ width: "100%" }}
          />
        </p>

        <div style={{ padding: "1em 1.2em" }}>
          <H4 font="secondary" style={{ color: black }}>
            {name}
          </H4>

          <p style={{ color: grey2, marginTop: "1em" }}>{description}</p>

          <p
            style={{
              textAlign: "center",
              marginTop: "1.5em",
              marginBottom: "1em",
            }}
          >
            <Button
              theme="primary"
              onClick={this.checkStyle.bind(this, id)}
              type="button"
              disabled={isLoading}
            >
              <Icon size={1.2} style={{ color: white }}>
                add
              </Icon>{" "}
              Subscribe
            </Button>
          </p>
        </div>
      </Card>
    );
  }
}

// Component Properties
Item.propTypes = {
  crate: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  messageShow: PropTypes.func.isRequired,
  messageHide: PropTypes.func.isRequired,
};

// Component State
function itemState(state) {
  return {
    user: state.user,
    stylePreference: state.user.stylePreference,
  };
}

export default connect(itemState, { create, messageShow, messageHide })(
  withRouter(Item)
);
