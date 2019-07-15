import React, { Component } from 'react'
import PageHeader from '../template/pageheader'
import Axios from 'axios'
import TodoForm from './todoForm'
import TodoList from '././todoList'
import Backend from '../config/config'

const URL = Backend.URI;

export default class Todo extends Component {
    constructor(props){
        super(props)
        this.state = {
            description: '',
            list: []
        }
        this.handleAdd = this.handleAdd.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleMarkAsDone = this.handleMarkAsDone.bind(this)
        this.handleMarkAsPending = this.handleMarkAsPending.bind(this)
        this.handleClear = this.handleClear.bind(this)

        this.refresh()
    }

    refresh(description = '') {
        const search = description ? `&description__regex=/${description}/` : ''
        Axios.get(`${URL}?sort=-createdAt${search}`)
            .then(response => this.setState({...this.state, description, list: response.data }))
            .catch(err => console.error(err))
    }

    handleChange(e){
        this.setState({
            ...this.state,
            description: e.target.value
        })
    }

    handleAdd() {
        const description = this.state.description
        Axios.post(URL, {description})
            .then(resp => this.refresh())
            .catch(error => console.log('error', error))
    }

    handleRemove(todo){
        Axios.delete(`${URL}/${todo._id}`)
            .then(response => this.refresh(this.state.description))
    }

    handleSearch(){
        this.refresh(this.state.description)
    }  

    handleMarkAsDone(todo){
        Axios.put(`${URL}/${todo._id}`, {...todo, done: true})
            .then(response => this.refresh(this.state.description))
            .catch(error => console.error(error))
    }

    handleMarkAsPending(todo){
        Axios.put(`${URL}/${todo._id}`, {...todo, done: false})
            .then(response => this.refresh(this.state.description))
            .catch(error => console.error(error))
    }

    handleClear(){
        this.refresh();
    }
    
    render() {
        return (
            <div>
                <PageHeader name='Tasks' small='Insert' />
                <TodoForm 
                    handleAdd={this.handleAdd}
                    handleChange={this.handleChange}
                    description={this.state.description} 
                    handleSearch={this.handleSearch}
                    handleClear={this.handleClear}
                />
                <TodoList 
                    list={this.state.list}
                    handleRemove={this.handleRemove}    
                    handleMarkAsDone={this.handleMarkAsDone}    
                    handleMarkAsPending={this.handleMarkAsPending}    
                />
            </div>
        )
    }
}

