import { pubsub } from "./pubsub/index.js";
import StartContainer from "./methods/StartContainer.js";
import StopContainer from "./methods/StopContainer.js";
import ListContainers from "./methods/ListContainers.js";
import CreateContainer from "./methods/CreateContainer.js";
import RemoveContainer from "./methods/RemoveContainer.js";

export default {
  Query: {
    containers: ListContainers,
  },
  Mutation: {
    startContainer: StartContainer,
    stopContainer: StopContainer,
    createContainer: CreateContainer,
    removeContainer: RemoveContainer,
  },
  Subscription: {
    containerCreated: {
      subscribe: () => pubsub.asyncIterator(["CONTAINER_CREATED"]),
    },
    containerRemoved: {
      subscribe: () => pubsub.asyncIterator(["CONTAINER_REMOVED"]),
    },
    containerStarted: {
      subscribe: () => pubsub.asyncIterator(["CONTAINER_STARTED"]),
    },
    containerStopped: {
      subscribe: () => pubsub.asyncIterator(["CONTAINER_STOPPED"]),
    },
  },
}