import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ContainerElement,
  CONTAINERS_QUERY,
  CREATE_CONTAINER_MUTATION,
  START_CONTAINER_MUTATION,
  CONTAINER_STARTED_SUBSCRIPTION,
  STOP_CONTAINER_MUTATION,
  CONTAINER_STOPPED_SUBSCRIPTION,
  REMOVE_CONTAINER_MUTATION,
  NEW_CONTAINER_FRAGMENT,
  CONTAINER_CREATED_SUBSCRIPTION,
  CONTAINER_REMOVED_SUBSCRIPTION
} from 'src/app/types';

@Component({
  selector: 'app-container-list',
  templateUrl: './container-list.component.html',
  styleUrls: ['./container-list.component.css']
})
export class ContainerListComponent implements OnInit {
  @Output() onSpinner = new EventEmitter();
  @Output() offSpinner = new EventEmitter();

  displayedColumns: string[] = ["id", "image", "name", "state", "status", "operation"];
  dataSource: ContainerElement[] = [];

  constructor(private apollo: Apollo, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: CONTAINERS_QUERY,
    }).valueChanges.subscribe((result: any) => {
      this.dataSource = result?.data?.containers;
    });

    this.apollo.subscribe({
      query: CONTAINER_CREATED_SUBSCRIPTION,
    }).subscribe((result: any) => {
      const createdContainer = result?.data?.containerCreated;
      if (createdContainer) {
        this.snackBar.open("Container Created", "", { duration: 2000 });
      }
    });

    this.apollo.subscribe({
      query: CONTAINER_REMOVED_SUBSCRIPTION,
    }).subscribe((result: any) => {
      const removedId = result?.data?.containerRemoved;
      if (removedId) {
        this.snackBar.open("Container Removed", "", { duration: 2000 });
      }
    });

    this.apollo.subscribe({
      query: CONTAINER_STARTED_SUBSCRIPTION,
    }).subscribe((result: any) => {
      const startedId = result?.data?.containerStarted;
      if (startedId) {
        this.snackBar.open("Container Started", "", { duration: 2000 });
      }
    });

    this.apollo.subscribe({
      query: CONTAINER_STOPPED_SUBSCRIPTION,
    }).subscribe((result: any) => {
      const stoppedId = result?.data?.containerStopped;
      if (stoppedId) {
        this.snackBar.open("Container Stopped", "", { duration: 2000 });
      }
    });

  }

  // create container
  createContainer() {
    this.onSpinner.emit();
    this.apollo.mutate({
      mutation: CREATE_CONTAINER_MUTATION,
      variables: {
        imageName: "nginx",
        tagName: "latest",
        containerName: "userservice1",
        hostPort: "8888",
        exposePort: "80",
      },
      update(store, result: any) {
        const createContainer = result?.data?.createContainer;
        if (createContainer) {
          store.modify({
            fields: {
              containers(existingContainers) {
                const newContainerRef = store.writeFragment({
                  data: createContainer,
                  fragment: NEW_CONTAINER_FRAGMENT
                });
                return [...existingContainers, newContainerRef];
              }
            }
          });
        }
      }
    }).subscribe((result: any) => {
      if (result?.errors) {
        const message = result?.errors[0].message;
        this.snackBar.open(message, "", { duration: 2000 });
      }
      this.offSpinner.emit();
    });
  }

  // start container
  startContainer(container: ContainerElement) {
    this.onSpinner.emit();
    this.apollo.mutate({
      mutation: START_CONTAINER_MUTATION,
      variables: {
        id: container.id
      }
    }).subscribe((result: any) => {
      if (result?.errors) {
        const message = result?.errors[0].message;
        this.snackBar.open(message, "", { duration: 2000 });
      }
      this.offSpinner.emit();
    });
  }

  // stop container
  stopContainer(container: ContainerElement) {
    this.onSpinner.emit();
    this.apollo.mutate({
      mutation: STOP_CONTAINER_MUTATION,
      variables: {
        id: container.id
      }
    }).subscribe((result: any) => {
      if (result?.errors) {
        const message = result?.errors[0].message;
        this.snackBar.open(message, "", { duration: 2000 });
      }
      this.offSpinner.emit();
    });
  }

  // remove container
  removeContainer(container: ContainerElement) {
    this.onSpinner.emit();
    this.apollo.mutate({
      mutation: REMOVE_CONTAINER_MUTATION,
      variables: {
        id: container.id
      },
      update: (store, { data: removeContainer }) => {
        if (removeContainer) {
          const { containers } = store.readQuery<any>({ query: CONTAINERS_QUERY });
          const target = containers.find((c: ContainerElement) => c.id === container.id);
          store.evict({ id: store.identify(target) });
        }
      }
    }).subscribe((result: any) => {
      if (result?.errors) {
        const message = result?.errors[0].message;
        this.snackBar.open(message, "", { duration: 2000 });
      }
      this.offSpinner.emit();
    })
  }
}
