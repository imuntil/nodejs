import React from 'react'
import ReactDOM from 'react-dom'
import Container from '../component/container'

class App extends React.Component<
  any,
  { columns: any; filtType: number; sortType: number }
> {
  constructor(props: any) {
    super(props)
    this.state = {
      columns: (window as any).reactInitData,
      filtType: (window as any).reactInitFiltType,
      sortType: (window as any).reactInitSortType,
    }
  }

  render() {
    return (
      <Container
        columns={this.state.columns}
        filt={(filtType: number) => {
          fetch(`./data?sort=${this.state.sortType}&filt=${filtType}`)
            .then((res) => res.json())
            .then((json) => {
              this.setState({
                columns: json,
                filtType: filtType,
              })
            })
        }}
        sort={(sortType: number) => {
          fetch(`./data?sort=${sortType}&filt=${this.state.filtType}`)
            .then((res) => res.json())
            .then((json) => {
              this.setState({
                columns: json,
                sortType: sortType,
              })
            })
        }}
      />
    )
  }
}
ReactDOM.render(<App />, document.getElementById('reactapp'))
