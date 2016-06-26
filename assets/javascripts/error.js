const React = require('react');

class Error extends React.Component {
  static propTypes = {
    errors: React.PropTypes.object.isRequired
  }

  render() {
    const {errors} = this.props;
    const renderedErrors = Object.keys(errors).map((key, i) => {
      return (
        <div key={i} className="error">
          {errors[key]}
        </div>
      );
    });
    
    return (
      <div className="errors">
        {renderedErrors}
      </div>
    );
  }
}

module.exports = Error;
