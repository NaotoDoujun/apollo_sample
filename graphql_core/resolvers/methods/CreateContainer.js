import { pubsub } from "../pubsub/index.js";
import docker from "../../infrastructure/dockerode/index.js";

export default async function CreateContainer(parent, { param }) {
  try {
    const images = await docker.listImages();
    const target = images.find(img => img.RepoTags[0] === `${param.imageName}:${param.tagName}`);
    const exposePortKey = `${param.exposePort}/tcp`;
    if (!target) {
      let stream = await docker.createImage({
        fromImage: param.imageName,
        tag: param.tagName
      });
      await new Promise((resolve, reject) => {
        docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
      });
    }

    const container = await docker.createContainer({
      Image: param.imageName,
      name: param.containerName,
      ExposedPorts: { [exposePortKey]: {} },
      HostConfig: {
        "PortBindings": {
          [exposePortKey]: [{ "HostPort": param.hostPort }]
        }
      },
    });
    const createdContainer = {
      id: container.id,
      image: param.imageName,
      name: param.containerName,
      state: 'created',
      status: 'Created'
    };
    // message for subscription
    pubsub.publish("CONTAINER_CREATED", { containerCreated: createdContainer });
    return createdContainer;

  } catch (e) {
    throw e;
  }
};