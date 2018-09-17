import React, { Component } from 'react';
import RestAPI from './rest-api';
import Service from './service';
import FormContainer from './FormContainer';
import ListContainer from './Listcontainer'
import './App.css';
import { Panel } from 'react-bootstrap';
import { Page, Navigator } from 'react-onsenui';
import debounce from 'lodash.debounce';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: null,
      list: [],
      searchInput: '',
      offset: 0,
      limit: 5,
      total: 0,
      sortBy: "id",
    }
    this.debounce = debounce(() => this.fetchData(), 1000)
    this.restAPI = new RestAPI();
    this.service = new Service();
  }

  fetchData() {
    const { limit, offset, searchInput } = this.state;
    let options = {
      fields: [
        "name",
        "projectTypeSelect",
        "isProject",
        "company",
        "membersUserSet",
        "timesheetLineList"
      ],
      data: {
        criteria: [
          { fieldName: "name", operator: "like", value: searchInput },
        ],
        operator: "and",
        _domain: `self.isProject = true and self.projectTypeSelect = :_xProjectTypeSelect`,
        _domainContext: { _fromProject: true, _xProjectTypeSelect: 1, _id: null, _model: "com.axelor.apps.project.db.Project" },
      },
      limit,
      offset,
      sortBy: [this.state.sortBy]
    }
    this.service.getData("com.axelor.apps.project.db.Project", options)
      .then((res) => res.json())
      .then(result =>
        this.setState({
          list: result.data,
          total: result.total,
        })
      );
  }

  componentWillMount() {
    console.log("Component will mount")
  }

  componentDidMount() {
    console.log("Component did mount")
    this.fetchData();
  }

  handlePrevPage() {
    const { offset, limit } = this.state;
    const newOffset = Math.floor(offset - limit);
    this.setState({ offset: newOffset }, () => this.fetchData());
  }

  handleNextPage() {
    const { offset, limit } = this.state;
    const newOffset = Math.floor(offset + limit);
    this.setState({ offset: newOffset }, () => this.fetchData());
  }

  onDelete(record) {
    this.setState((prevState) => {
      return { list: prevState.list.filter(x => x.id !== record.id) }
    })
    // this.restAPI.delete('com.axelor.apps.project.db.Project', record.id).then(res => res.json())
  };

  onUpdate(record) {
    this.setState({
      record: { ...record }
    });

    //----static update----
    // const data = {
    //     name: 'Project aaa',
    //     fullName: 'Project aaa',
    //     projectTypeSelect: 1,
    //     timesheetLineList: [{ id: 1 }, { id: 2 }],
    //     membersUserSet: [{ id: 1 }, { id: 2 }],
    //     company: { id: 1 },
    //     version: 1
    // }
    // this.restAPI.update('com.axelor.apps.project.db.Project', data, id).then(res => res.json())
    //     .then((result => console.log("result", result)));
  };

  getSearchedInput(e) {
    // var debounce = require('debounce');
    this.setState({
      searchInput: e.target.value
    }, () => {
      this.debounce();
    });
  }

  sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : 1);
    });
  }

  getFilteredList() {
    const { list, sortBy } = this.state;
    let sortedList = []
    if (list) {
      sortedList = this.sortByKey(list, sortBy);
      return sortedList
    }
  }

  findIndex(id) {
    const { list } = this.state;
    return list.findIndex(record => record.id === id);
  }

  handleFormSubmit(record) {
    const formPayload = {
      name: record.name,
      fullName: record.name,
      projectTypeSelect: record.projectTypeSelect,
      timesheetLineList: record.timesheetLineList,
      membersUserSet: record.membersUserSet,
      company: record.company
    };
    this.setState(prevState => {
      const { list } = prevState
      if (record.id) {
        const formIndex = this.findIndex(record.id);
        list[formIndex] = record;
        this.restAPI.update('com.axelor.apps.project.db.Project', list[formIndex], record.id)
          .then(res => res.json())
          .then(result => {
            return {
              list: [...list],
              record: null
            }
          });
      }
      else {
        this.restAPI.add('com.axelor.apps.project.db.Project', formPayload).then(res => console.log('res', res));
        console.log('All data: ' + JSON.stringify(record));
      }
    });
  }

  render() {
    const { limit, offset, total, searchInput, record } = this.state;
    console.log("render App===>")
    return (
      <div>
        <FormContainer
          record={record}
          handleFormSubmit={this.handleFormSubmit.bind(this)} />
        <br />
        <Panel bsStyle="info">
          <Panel.Heading>
            <Panel.Title componentClass="h3">List of Projects</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <ListContainer
              list={this.getFilteredList()}
              searchInput={searchInput}
              onUpdate={this.onUpdate.bind(this)}
              onDelete={this.onDelete.bind(this)}
              offset={offset}
              total={total}
              limit={limit}
              handleNextPage={() => this.handleNextPage()}
              handlePrevPage={() => this.handlePrevPage()}
              getSearchedInput={this.getSearchedInput.bind(this)} />
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

export default App;
