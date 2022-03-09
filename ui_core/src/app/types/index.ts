export * from './gql'

export interface ContainerElement {
  id: string
  image: string
  name: string
  state: string
  status: string
}