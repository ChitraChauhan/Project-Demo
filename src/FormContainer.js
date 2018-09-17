import React, { Component } from 'react';
import SelectComponent from './SelectComponent';
import { FormGroup, FormControl, ControlLabel, Col, Panel, Form, Button } from 'react-bootstrap';

const initialForm = {
    name: '',
    fullName: '',
    company: '',
    membersUserSet: [],
    projectTypeSelect: '',
    timesheetLineList: []
}

export class FormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initialForm }
    }

    // to prevent extra rerender
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.record === nextProps.record && this.state === nextState) {
            console.log("form:::shouldcomponentupdate==>false")
            return false;
        }
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.record && nextProps.record.id && this.state.id !== nextProps.record.id) {
            console.log("componentWillRecieveProps")
            this.setState(nextProps.record);
        }
    }

    componentWillUnmount() {
        console.log("component Will Unmount")
    }

    onChange(e, key) {
        if (key) {
            this.setState({ [key]: e })
        }
        else {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        // save callback
        this.props.handleFormSubmit(this.state);
        // reset record
        this.setState(initialForm);
    }

    render() {
        console.log("render FormContainer===>")
        const { name, company, membersUserSet, projectTypeSelect, timesheetLineList } = this.state;
        const formInstance = (
            <Form horizontal onSubmit={(e) => this.handleFormSubmit(e)}>

                <FormGroup controlId="formname">
                    <Col sm={1} componentClass={ControlLabel}>Project Name</Col>
                    <Col sm={10}>
                        <FormControl
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => this.onChange(e)}
                            required="true" />
                    </Col>
                </FormGroup>

                <SelectComponent
                    label="Company:"
                    labelKey='name'
                    onChange={(e) => this.onChange(e, 'company')}
                    value={company}
                    multi={false}
                    entity='com.axelor.apps.base.db.Company'
                    isnestedFields='false' />

                <SelectComponent
                    label="Members Associated to:"
                    labelKey='fullName'
                    onChange={(e) => this.onChange(e, 'membersUserSet')}
                    value={membersUserSet}
                    multi={true}
                    entity='com.axelor.auth.db.User'
                    isnestedFields='false' />

                <FormGroup controlId="formprojecttype">
                    <Col sm={1} componentClass={ControlLabel}>Project Type Select</Col>
                    <Col sm={10}>
                        <FormControl componentClass="select"
                            name="projectTypeSelect"
                            value={projectTypeSelect}
                            onChange={(e) => this.onChange(e)}>
                            <option value="1">Project</option>
                            <option value="2">Project phase</option>
                        </FormControl>
                    </Col>
                </FormGroup>

                <SelectComponent
                    label="Logged Time:"
                    labelKey='timesheet.fullName'
                    onChange={(e) => this.onChange(e, 'timesheetLineList')}
                    value={timesheetLineList}
                    multi={true}
                    entity='com.axelor.apps.hr.db.TimesheetLine'
                    isnestedFields='true'
                    nestedField='timesheet' />

                <FormGroup>
                    <Col smOffset={1} sm={10}>
                        <Button bsStyle="primary" type="submit"> Submit </Button>
                    </Col>
                </FormGroup>

            </Form>
        );
        return (
            <div>
                <Panel bsStyle="info">
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">Project Form</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>  {formInstance}</Panel.Body>
                </Panel>
            </div>
        )
    }
}
export default FormContainer
