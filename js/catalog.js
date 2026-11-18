/** @typedef {{ en: string, vn: string }} LocaleText */
/** @typedef {{ en: string[], vn: string[] }} LocaleList */
/** @typedef {{ id: string, title: LocaleText, baseline: LocaleList, skills: LocaleList, diagram: string, body: LocaleText }} SectionMeta */
/** @typedef {{ id: string, title: LocaleText, summary: LocaleText, sections: SectionMeta[] }} Course */

const courses = [
  {
    id: 'design-patterns',
    title: { en: 'Design Patterns', vn: 'Mẫu thiết kế' },
    summary: {
      en: 'Reusable object-oriented solutions for common software design problems.',
      vn: 'Các giải pháp hướng đối tượng tái sử dụng cho bài toán thiết kế phần mềm.',
    },
    sections: [
      {
        id: 'singleton',
        title: { en: 'Singleton', vn: 'Singleton' },
        diagram: 'singleton',
        baseline: {
          en: ['Classes and objects in your language', 'Static fields or module scope'],
          vn: ['Lớp và đối tượng trong ngôn ngữ bạn dùng', 'Biến static hoặc phạm vi module'],
        },
        skills: {
          en: [
            'Explain when a single shared instance is appropriate',
            'Implement a lazy-initialized singleton safely',
          ],
          vn: [
            'Giải thích khi nào nên dùng một instance duy nhất',
            'Triển khai singleton khởi tạo lười an toàn',
          ],
        },
        body: {
          en: `## One instance, global access

The **Singleton** pattern ensures a class has only one instance and exposes a global access point.

Use it for shared resources such as a configuration loader or connection pool—not for convenience globals.

\`\`\`
class Config {
  static #instance;
  static getInstance() {
    if (!Config.#instance) Config.#instance = new Config();
    return Config.#instance;
  }
}
\`\`\`

- Prefer dependency injection when tests need substitutes
- In JavaScript, a module's export can already act as a singleton`,
          vn: `## Một instance, truy cập toàn cục

**Singleton** đảm bảo lớp chỉ có một instance và cung cấp điểm truy cập toàn cục.

Dùng cho tài nguyên dùng chung như loader cấu hình hoặc connection pool—không phải biến toàn cục tiện lợi.

\`\`\`
class Config {
  static #instance;
  static getInstance() {
    if (!Config.#instance) Config.#instance = new Config();
    return Config.#instance;
  }
}
\`\`\`

- Ưu tiên dependency injection khi test cần thay thế
- Trong JavaScript, export của module đã có thể đóng vai singleton`,
        },
      },
      {
        id: 'factory-method',
        title: { en: 'Factory Method', vn: 'Factory Method' },
        diagram: 'factory',
        baseline: {
          en: ['Inheritance or composition basics', 'Interfaces or abstract classes'],
          vn: ['Cơ bản về kế thừa hoặc composition', 'Interface hoặc lớp trừu tượng'],
        },
        skills: {
          en: ['Defer object creation to subclasses', 'Keep client code independent of concrete types'],
          vn: ['Hoãn việc tạo đối tượng cho lớp con', 'Giữ code client độc lập với kiểu cụ thể'],
        },
        body: {
          en: `## Create objects without naming classes

**Factory Method** lets a base type define an interface for creating objects while subclasses choose the concrete type.

Document parsers are a classic example: the framework calls \`createParser()\`, each format supplies its own class.

- Clients depend on the product interface, not \`new ConcreteProduct()\`
- Pairs well with dependency injection containers`,
          vn: `## Tạo đối tượng mà không gắn tên lớp

**Factory Method** cho phép kiểu cơ sở định nghĩa giao diện tạo đối tượng, còn lớp con chọn kiểu cụ thể.

Ví dụ kinh điển: framework gọi \`createParser()\`, mỗi định dạng cung cấp lớp riêng.

- Client phụ thuộc interface sản phẩm, không phải \`new ConcreteProduct()\`
- Kết hợp tốt với container dependency injection`,
        },
      },
      {
        id: 'observer',
        title: { en: 'Observer', vn: 'Observer' },
        diagram: 'observer',
        baseline: {
          en: ['Events or callbacks in your UI framework', 'Lists and iteration'],
          vn: ['Sự kiện hoặc callback trong framework UI', 'Danh sách và vòng lặp'],
        },
        skills: {
          en: [
            'Decouple publishers from subscribers',
            'Avoid update leaks by unsubscribing',
          ],
          vn: [
            'Tách publisher khỏi subscriber',
            'Tránh rò rỉ cập nhật bằng cách hủy đăng ký',
          ],
        },
        body: {
          en: `## Notify many listeners

The **Observer** pattern defines a one-to-many dependency: when subject state changes, all observers update.

DOM events and reactive stores are everyday observers.

- Subjects should not know observer internals
- Prefer weak references or explicit \`off()\` to prevent memory leaks`,
          vn: `## Thông báo nhiều listener

**Observer** định nghĩa quan hệ một-nhiều: khi trạng thái subject đổi, mọi observer cập nhật.

Sự kiện DOM và store reactive là observer hằng ngày.

- Subject không nên biết chi tiết observer
- Dùng tham chiếu yếu hoặc \`off()\` rõ ràng để tránh rò bộ nhớ`,
        },
      },
    ],
  },
  {
    id: 'system-design',
    title: { en: 'System Design', vn: 'Thiết kế hệ thống' },
    summary: {
      en: 'Building blocks for reliable, scalable web services.',
      vn: 'Các khối xây dựng cho dịch vụ web tin cậy và mở rộng.',
    },
    sections: [
      {
        id: 'load-balancer',
        title: { en: 'Load Balancing', vn: 'Cân bằng tải' },
        diagram: 'load-balancer',
        baseline: {
          en: ['HTTP request/response', 'Running more than one app instance'],
          vn: ['HTTP request/response', 'Chạy nhiều hơn một instance ứng dụng'],
        },
        skills: {
          en: [
            'Place a load balancer in front of stateless services',
            'Compare round-robin vs least-connections routing',
          ],
          vn: [
            'Đặt load balancer trước dịch vụ stateless',
            'So sánh round-robin và least-connections',
          ],
        },
        body: {
          en: `## Spread traffic across instances

A **load balancer** accepts client traffic and forwards it to healthy backend servers.

\`\`\`
Client → Load Balancer → App₁ / App₂ / App₃
\`\`\`

- Health checks remove failed nodes from rotation
- Sticky sessions complicate deploys; keep app state in Redis or the database when possible`,
          vn: `## Phân tán traffic qua nhiều instance

**Load balancer** nhận traffic client và chuyển tiếp tới máy chủ backend khỏe.

\`\`\`
Client → Load Balancer → App₁ / App₂ / App₃
\`\`\`

- Health check loại node lỗi khỏi vòng quay
- Sticky session làm deploy phức tạp; đưa state vào Redis hoặc DB khi có thể`,
        },
      },
      {
        id: 'caching',
        title: { en: 'Caching', vn: 'Bộ nhớ đệm' },
        diagram: 'cache-layer',
        baseline: {
          en: ['Key-value stores', 'TTL concept'],
          vn: ['Kho key-value', 'Khái niệm TTL'],
        },
        skills: {
          en: ['Pick cache-aside vs write-through', 'Set TTLs to limit stale reads'],
          vn: ['Chọn cache-aside hay write-through', 'Đặt TTL để giới hạn đọc dữ liệu cũ'],
        },
        body: {
          en: `## Faster reads, trickier consistency

**Caching** stores hot data closer to the reader—memory, CDN edge, or Redis.

Cache-aside: app reads cache first, on miss loads DB and populates cache.

- Always define eviction and invalidation
- Monitor hit ratio; a low ratio may mean wrong keys or TTL`,
          vn: `## Đọc nhanh hơn, nhất quán khó hơn

**Caching** lưu dữ liệu nóng gần người đọc—bộ nhớ, CDN edge, hoặc Redis.

Cache-aside: app đọc cache trước, miss thì load DB rồi ghi cache.

- Luôn định nghĩa eviction và invalidation
- Theo dõi hit ratio; thấp có thể do key hoặc TTL sai`,
        },
      },
      {
        id: 'database-scaling',
        title: { en: 'Database Scaling', vn: 'Mở rộng cơ sở dữ liệu' },
        diagram: 'db-replicas',
        baseline: {
          en: ['Primary/replica replication', 'SQL vs NoSQL trade-offs'],
          vn: ['Replication primary/replica', 'Đánh đổi SQL vs NoSQL'],
        },
        skills: {
          en: ['Route reads to replicas and writes to primary', 'Recognize when sharding is unavoidable'],
          vn: ['Đọc từ replica, ghi vào primary', 'Nhận biết khi sharding là bắt buộc'],
        },
        body: {
          en: `## Scale reads before you shard

Start with **read replicas** and connection pooling. Sharding splits data by key when a single node cannot hold or serve the working set.

- Replication lag means reads may be slightly stale
- Cross-shard queries are expensive—design keys early`,
          vn: `## Mở rộng đọc trước khi shard

Bắt đầu bằng **read replica** và connection pooling. Sharding tách dữ liệu theo key khi một node không chứa hoặc phục vụ được working set.

- Replication lag khiến đọc có thể hơi cũ
- Truy vấn cross-shard tốn kém—thiết kế key sớm`,
        },
      },
    ],
  },
  {
    id: 'docker',
    title: { en: 'Docker', vn: 'Docker' },
    summary: {
      en: 'Package apps and dependencies into portable containers.',
      vn: 'Đóng gói ứng dụng và phụ thuộc thành container di động.',
    },
    sections: [
      {
        id: 'container-layers',
        title: { en: 'Container Layers', vn: 'Lớp container' },
        diagram: 'container-layers',
        baseline: {
          en: ['Filesystem basics', 'Processes on Linux or macOS'],
          vn: ['Cơ bản filesystem', 'Process trên Linux hoặc macOS'],
        },
        skills: {
          en: [
            'Describe image layers and the container runtime',
            'Explain copy-on-write and ephemeral container storage',
          ],
          vn: [
            'Mô tả layer image và container runtime',
            'Giải thích copy-on-write và storage container tạm',
          ],
        },
        body: {
          en: `## Images are stacked layers

A Docker **image** is read-only layers; a **container** adds a thin writable layer on top.

Each Dockerfile instruction can create a new layer—order matters for cache reuse.

\`\`\`
FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm ci
COPY . .
\`\`\`

- Unpinned tags like \`latest\` break reproducibility`,
          vn: `## Image là các lớp chồng nhau

**Image** Docker chỉ đọc; **container** thêm một lớp ghi mỏng phía trên.

Mỗi lệnh Dockerfile có thể tạo layer mới—thứ tự ảnh hưởng cache.

\`\`\`
FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm ci
COPY . .
\`\`\`

- Tag không ghim như \`latest\` phá reproducibility`,
        },
      },
      {
        id: 'images-and-dockerfile',
        title: { en: 'Images & Dockerfile', vn: 'Image & Dockerfile' },
        diagram: 'image-layers',
        baseline: {
          en: ['Command line comfort', 'Application dependencies (npm, pip, etc.)'],
          vn: ['Quen dòng lệnh', 'Phụ thuộc ứng dụng (npm, pip, v.v.)'],
        },
        skills: {
          en: ['Build an image with docker build', 'Keep images small with multi-stage builds'],
          vn: ['Build image bằng docker build', 'Thu nhỏ image với multi-stage build'],
        },
        body: {
          en: `## Dockerfile as build recipe

\`docker build -t myapp:1.0 .\` runs instructions in the Dockerfile and tags the result.

Multi-stage builds copy only artifacts from a builder stage into a slim runtime image.

- Use \`.dockerignore\` to skip \`node_modules\` and build artifacts
- Run as a non-root user in production images`,
          vn: `## Dockerfile là công thức build

\`docker build -t myapp:1.0 .\` chạy lệnh trong Dockerfile và gắn tag kết quả.

Multi-stage copy chỉ artifact từ stage build sang image runtime gọn.

- Dùng \`.dockerignore\` để bỏ \`node_modules\` và file build
- Chạy non-root trên image production`,
        },
      },
      {
        id: 'compose',
        title: { en: 'Docker Compose', vn: 'Docker Compose' },
        diagram: 'compose',
        baseline: {
          en: ['YAML syntax', 'Local development workflows'],
          vn: ['Cú pháp YAML', 'Quy trình phát triển local'],
        },
        skills: {
          en: [
            'Define multi-container apps in compose.yaml',
            'Use docker compose up for local stacks',
          ],
          vn: [
            'Khai báo ứng dụng đa container trong compose.yaml',
            'Dùng docker compose up cho stack local',
          ],
        },
        body: {
          en: `## Run the whole stack locally

**Compose** wires services, networks, and volumes in one file.

\`\`\`yaml
services:
  web:
    build: .
    ports: ["8080:8080"]
  db:
    image: postgres:16
\`\`\`

\`docker compose up\` builds images if needed and attaches logs to one terminal.`,
          vn: `## Chạy cả stack trên máy local

**Compose** nối service, network và volume trong một file.

\`\`\`yaml
services:
  web:
    build: .
    ports: ["8080:8080"]
  db:
    image: postgres:16
\`\`\`

\`docker compose up\` build image nếu cần và gom log một terminal.`,
        },
      },
    ],
  },
];

export function getCatalog() {
  return { courses };
}