import docker from "../../infrastructure/dockerode/index.js";

export default async function ListContainers() {
  try {
    const containers = await docker.listContainers({ all: true });
    return containers.map((container) => {
      return {
        id: container.Id,
        image: container.Image,
        name: container.Names.shift(),
        state: container.State,
        status: container.Status
      }
    });
  } catch (e) {
    throw e;
  }
}