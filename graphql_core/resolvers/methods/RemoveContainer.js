import { pubsub } from "../pubsub/index.js";
import docker from "../../infrastructure/dockerode/index.js";

export default async function RemoveContainer(parent, { container }) {
  try {
    const target = docker.getContainer(container.id);
    await target.remove({ force: true });
    // message for subscription
    pubsub.publish("CONTAINER_REMOVED", { containerRemoved: container.id });
    return container.id;
  } catch (e) {
    throw e;
  }
};