// SPDX-License-Identifier: GPL-3.0-or-later
#include <iostream>
#include <string>
#include <sys/socket.h>
#include <sys/un.h>
#include <unistd.h>

#define AA_SOCKET_PATH "/dev/shm/android-on-cluster/ctl.sock"

int main() {
    std::cout << "Initializing Android Auto Cluster Bridge Daemon..." << std::endl;

    int server_fd = socket(AF_UNIX, SOCK_STREAM, 0);
    if (server_fd < 0) {
        std::cerr << "Failed to create Android projection UNIX socket." << std::endl;
        return 1;
    }

    unlink(AA_SOCKET_PATH);
    sockaddr_un addr{};
    addr.sun_family = AF_UNIX;
    strncpy(addr.sun_path, AA_SOCKET_PATH, sizeof(addr.sun_path) - 1);

    if (bind(server_fd, (struct sockaddr*)&addr, sizeof(addr)) < 0) {
        std::cerr << "Failed to bind Android socket path." << std::endl;
        close(server_fd);
        return 1;
    }

    listen(server_fd, 5);
    std::cout << "Android Auto Bridge listening on " << AA_SOCKET_PATH << std::endl;

    while (true) {
        int client_fd = accept(server_fd, nullptr, nullptr);
        if (client_fd < 0) continue;

        std::string status = "{\"ev\":\"status\",\"state\":\"showing\",\"page\":\"Android Auto Map\"}\n";
        write(client_fd, status.c_str(), status.length());

        sleep(1);
        close(client_fd);
    }

    return 0;
}
