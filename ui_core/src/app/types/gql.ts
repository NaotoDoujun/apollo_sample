import { gql } from "apollo-angular";

export const CONTAINERS_QUERY = gql`
  query Containers {
    containers {
      id
      image
      name
      state
      status
    }
  }
`;

export const START_CONTAINER_MUTATION = gql`
  mutation StartContainer($id:String){
    startContainer(container:{id: $id}){
      id
      image
      name
      state
      status
    }
  }
`;

export const CONTAINER_STARTED_SUBSCRIPTION = gql`
  subscription ContainerStarted {
    containerStarted {
      id
      image
      name
      state
      status
    }
  }
`;

export const STOP_CONTAINER_MUTATION = gql`
  mutation StopContainer($id:String){
    stopContainer(container:{id: $id}){
      id
      image
      name
      state
      status
    }
  }
`;

export const CONTAINER_STOPPED_SUBSCRIPTION = gql`
  subscription ContainerStopped {
    containerStopped {
      id
      image
      name
      state
      status
    }
  }
`;

export const CREATE_CONTAINER_MUTATION = gql`
  mutation CreateContainer($imageName:String, $tagName:String, $containerName:String, $hostPort:String, $exposePort:String){
    createContainer(param:{
      imageName: $imageName,
      tagName: $tagName,
      containerName: $containerName,
      hostPort: $hostPort,
      exposePort: $exposePort
    }){
      id
      image
      name
      state
      status
    }
  }
`;

export const CONTAINER_CREATED_SUBSCRIPTION = gql`
  subscription ContainerCreated {
    containerCreated {
      id
      image
      name
      state
      status
    }
  }
`;

export const NEW_CONTAINER_FRAGMENT = gql`
  fragment NewContainer on Container {
    id
    image
    name
    state
    status
  }
`;

export const REMOVE_CONTAINER_MUTATION = gql`
  mutation RemoveContainer($id:String){
    removeContainer(container:{id: $id})
  }
`;

export const CONTAINER_REMOVED_SUBSCRIPTION = gql`
  subscription ContainerRemoved {
    containerRemoved
  }
`;