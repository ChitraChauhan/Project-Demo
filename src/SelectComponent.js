import React, { Component } from 'react'
import Service from './service'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { FormGroup, ControlLabel, Col } from 'react-bootstrap';

export default class SelectComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
        }
        this.service = new Service();
    }

    fetchRecords() {
        this.service.getData(this.props.entity).then(res => res.json())
            .then(result =>
                this.setState({
                    children: result.data,
                })
            )
    }

    componentDidMount() {
        this.fetchRecords();
    }

    getValue(r, text) {
        let objValue = r;
        const fields = text.split('.');
        let field;
        for (let i = 0; i < fields.length; i++) {
            field = fields[i];
            objValue = objValue[field];
        }
        return { objValue, field };
    }

    render() {
        const { onChange, labelKey, multi, value, label } = this.props;
        let newLabelKey;
        if (this.props.isnestedFields === "true") {
            this.state.children.map((r, index) => {
                let nestedValue = this.getValue(r, labelKey)
                r[nestedValue.field] = nestedValue.objValue
                newLabelKey = nestedValue.field
                return nestedValue
            })
        }
        else {
            newLabelKey = labelKey
        }
        return (
            <div>
                <FormGroup>
                    <Col sm={1} componentClass={ControlLabel}>{label}</Col>
                    <Col sm={10}>
                        <Select
                            valueKey='id'
                            labelKey={newLabelKey}
                            options={this.state.children}
                            onChange={(e) => onChange(e) || this.fetchRecords()}
                            value={value}
                            multi={multi} />
                    </Col>
                </FormGroup>

            </div>
        );
    }
}