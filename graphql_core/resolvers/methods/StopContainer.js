import { pubsub } from "../pubsub/index.js";
import docker from "../../infrastructure/dockerode/index.js";

export default async function StopContainer(parent, { container }) {
  try {
    const target = docker.getContainer(container.id);
    await target.stop();
    const containers = await docker.listContainers({ all: true });
    const targetContainer = containers.find((c) => c.Id === container.id);
    const stoppedContainer = {
      id: targetContainer.Id,
      image: targetContainer.Image,
      name: targetContainer.Names.shift(),
      state: targetContainer.State,
      status: targetContainer.Status
    };
    // message for subscription
    pubsub.publish("CONTAINER_STOPPED", { containerStopped: stoppedContainer });
    return stoppedContainer;
  } catch (e) {
    throw e;
  }
};