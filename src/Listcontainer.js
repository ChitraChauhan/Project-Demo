import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { SearchInput } from 'react-onsenui';

export class ListContainer extends Component {

    shouldComponentUpdate(nextProps) {
        if (this.props.list === nextProps.list) {
            console.log("List::::shouldcomponentupdate==>false")
            return false;
        }
        return true;
    }

    render() {
        console.log("render ListContainer===>")
        const { list, onUpdate, onDelete, offset, total, limit, getSearchedInput, handleNextPage, handlePrevPage, searchInput } = this.props;
        const listgroupInstance = (
            <div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <td>Id</td>
                            <td>Project</td>
                            <td>Company</td>
                            <td>Project Type Select</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {list && list.map((data, index) =>
                            <TableRow key={index} record={data} onUpdate={() => onUpdate(data)} onDelete={() => onDelete(data)} />
                        )}
                    </tbody>

                </table>
            </div>
        );
        const isPrevDisable = offset === 0;
        const isNextDisable = offset + limit >= total;
        return (
            <div>
                <div style={{ float: 'right' }}>
                    {offset + 1 + ' to ' + (offset + limit <= total ? offset + limit : total) + ' of ' + total + ' '}
                    <i onClick={() => !isPrevDisable && handlePrevPage()}
                        style={{ paddingRight: '25px' }}
                        className={isPrevDisable ? "disabled" : "fa fa-chevron-left"}
                    />
                    <i onClick={() => !(isNextDisable) && handleNextPage()}
                        className={isNextDisable ? "disabled" : "fa fa-chevron-right"}
                    />
                </div>
                <div>
                    <div className='center' />
                    <section style={{ textAlign: 'center' }}>
                        <p>
                            <SearchInput
                                placeholder='Search' value={searchInput} onChange={(e) => getSearchedInput(e)} />
                        </p>
                    </section>
                    {listgroupInstance}
                </div>
            </div>
        )
    }
}
class TableRow extends Component {
    render() {
        const { record, onUpdate, onDelete } = this.props;
        return (
            <tr>
                <td>{record.id}</td>
                <td>{record.name}</td>
                <td>{record.company && record.company.name}</td>
                <td>{record.projectTypeSelect}</td>
                <td>
                    <Button type="submit" bsStyle="primary" onClick={() => onUpdate(record)}>Update</Button>
                </td>
                <td>
                    <Button type="submit" bsStyle="primary" onClick={() => onDelete(record)}>Delete</Button>
                </td>
            </tr>
        );
    }
}

export default ListContainer