import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Table } from 'reactstrap';
import IfComponent from './components/IfComponent';
import GithubRepository from './repositories/GithubRepository';
import loading from './assets/loading.gif';

class App extends Component {
  state = {
    termo: '',
    page: 1,
    showLoading: false,
    lastResult: false,
    repositories: []
  };

  scrollObserve;

  constructor() {
    super();
    this.scrollObserve = React.createRef();
  }

  componentDidMount() {

    const intersectionObserver = new IntersectionObserver((entries) => {

      const radio = entries[ 0 ].intersectionRatio;

      if(radio > 0 && this.state.termo != '') {
        this.setState({ showLoading: true, page: (this.state.page + 1) }, () => {
          const { termo, page } = this.state;

          GithubRepository.findRepositoriesGit(termo, page).then(({ data }) => {
            const repositories = this.state.repositories;
            repositories.push(...data.items);

            this.setState({
              repositories: repositories,
              showLoading: false
            });
          });
        });
      }
    });

    intersectionObserver.observe(this.scrollObserve.current);

  }


  findRepositories = () => {
    const { termo } = this.state;

    this.setState({
      page: 1,
      showLoading: false,
      lastResult: false
    });

    GithubRepository.findRepositoriesGit(termo, 1).then(({ data }) => {
      this.setState({
        repositories: data.items,
        showLoading: false
      });
    });
  };

  render() {

    const { termo, page, showLoading, repositories } = this.state;

    return (
      <div className="App p-4">
        <h1>Digite o termo</h1>
        <Form>
          <FormGroup>
            <Input onChange={ (e) => this.setState({ termo: e.target.value }) } type={ 'text' }/>
          </FormGroup>
          <Button onClick={ () => {
            this.findRepositories();
          } }>Buscar</Button>
        </Form>
        <br/>
        <br/>

        <IfComponent conditional={ repositories.length > 0 }>
          <Table>
            <thead>
            <tr>
              <th>Avatar</th>
              <th>Url</th>
              <th>Stars</th>
            </tr>
            </thead>
            <tbody>
            { repositories.map(r => {
              return (
                <tr>
                  <td><img src={ r.owner.avatar_url } width='50'/></td>
                  <td><a href={ r.html_url } target='_blank'>{ r.html_url }</a></td>
                  <td>{ r.stargazers_count }</td>
                </tr>
              );
            }) }

            </tbody>
          </Table>
        </IfComponent>
        <div ref={ this.scrollObserve }></div>
        <IfComponent conditional={ showLoading }>
          <div><img src={ loading } width='50'/>Loading</div>
        </IfComponent>
      </div>
    );
  }
}

export default App;
