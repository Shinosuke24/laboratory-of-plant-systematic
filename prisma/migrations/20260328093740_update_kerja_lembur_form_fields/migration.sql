-- AlterTable
ALTER TABLE `KerjaLembur` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `jadwalPelaksanaanLembur` TEXT NULL,
    ADD COLUMN `nama` VARCHAR(191) NULL,
    ADD COLUMN `namaDosenPembimbing` VARCHAR(191) NULL,
    ADD COLUMN `namaInstitusi` VARCHAR(191) NULL,
    ADD COLUMN `nim` VARCHAR(191) NULL,
    ADD COLUMN `noWa` VARCHAR(191) NULL,
    ADD COLUMN `suratPermohonanUrl` VARCHAR(191) NULL;
