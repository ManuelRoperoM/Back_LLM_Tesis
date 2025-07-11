import { Injectable } from "@nestjs/common";

@Injectable()
export class EmbeddingService {
  //   private worker: any;
  //   private readonly logger = new Logger(EmbeddingService.name);
  //   private worker = fork("./embedding.worker.mjs", {
  //     execArgv: ["--experimental-vm-modules"],
  //   });
  //   constructor() {
  // Ruta absoluta al worker
  //     const workerPath = join(__dirname, "embedding.worker.mjs");
  //     this.worker = fork(workerPath, {
  //       execArgv: ["--experimental-vm-modules"],
  //       stdio: ["pipe", "pipe", "pipe", "ipc"],
  //     });
  //     this.worker.on("error", (error) => {
  //       this.logger.error(`Worker error: ${error.message}`);
  //     });
  //     this.worker.stderr.on("data", (data) => {
  //       this.logger.error(`Worker stderr: ${data.toString()}`);
  //     });
  //   }
  //   async getEmbedding(text: string): Promise<number[]> {
  //     return new Promise((resolve, reject) => {
  //       const timeout = setTimeout(() => {
  //         reject(new Error("Timeout after 30s"));
  //       }, 30000);
  //       this.worker.once("message", (response) => {
  //         clearTimeout(timeout);
  //         if (response.error) {
  //           reject(new Error(response.error));
  //         } else {
  //           resolve(response);
  //         }
  //       });
  //       this.worker.send(text);
  //     });
  //   }
  //   constructor() {
  //     env.localModelPath = "/home/manuel/models"; // ← Directorio padre
  //     env.allowRemoteModels = false; // ← Fuerza modo local
  //   }
  //   private embedder: any;
  //   private readonly logger = new Logger(EmbeddingService.name);
  //   private async dynamicImport(module: string) {
  //     const result = execSync(
  //       `node -e "import('${module}').then(m=>console.log(JSON.stringify('ESM_IMPORT_SUCCESS')))"`,
  //       {
  //         encoding: "utf-8",
  //       },
  //     );
  //     return eval(result.trim());
  //   }
  //   async getEmbedding(text: string): Promise<number[]> {
  //     try {
  //       // Usamos import dinámico indirecto
  //       const { pipeline } = await this.dynamicImport("@xenova/transformers");
  //       if (!this.embedder) {
  //         this.embedder = await pipeline("feature-extraction", "bge-m3", {
  //           local_files_only: true,
  //           quantized: false,
  //           model_file: "pytorch_model.bin", // Especifica el formato
  //         });
  //       }
  //       const output = await this.embedder(text);
  //       return Array.from(output.data);
  //     } catch (error) {
  //       this.logger.error(`Error: ${error.message}`);
  //       throw new Error("Falló generación de embedding");
  //     }
  //   }
}
