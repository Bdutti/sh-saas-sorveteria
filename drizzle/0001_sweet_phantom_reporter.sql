CREATE TABLE `backups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileSize` int NOT NULL,
	`fileUrl` text,
	`backupType` varchar(50) NOT NULL DEFAULT 'manual',
	`status` varchar(50) NOT NULL DEFAULT 'completed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`notes` text,
	CONSTRAINT `backups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cashTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('entrada','saida') NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text,
	`amount` int NOT NULL,
	`paymentMethod` enum('dinheiro','cartao_credito','cartao_debito','pix','boleto','outro') DEFAULT 'dinheiro',
	`reference` varchar(255),
	`transactionDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cashTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`address` text,
	`city` varchar(100),
	`state` varchar(2),
	`zipCode` varchar(10),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productCategories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productImports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`totalRows` int NOT NULL,
	`successRows` int DEFAULT 0,
	`failedRows` int DEFAULT 0,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`errorLog` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `productImports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`categoryId` int,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`cost` int,
	`stock` int NOT NULL DEFAULT 0,
	`minStock` int DEFAULT 0,
	`sku` varchar(100),
	`barcode` varchar(100),
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saleItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`saleId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`unitPrice` int NOT NULL,
	`subtotal` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saleItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`customerId` int,
	`totalAmount` int NOT NULL,
	`discount` int DEFAULT 0,
	`paymentMethod` enum('dinheiro','cartao_credito','cartao_debito','pix','boleto','outro') DEFAULT 'dinheiro',
	`status` enum('pendente','concluida','cancelada') DEFAULT 'concluida',
	`notes` text,
	`saleDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stockAlerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`alertType` varchar(50) NOT NULL DEFAULT 'low_stock',
	`status` varchar(50) NOT NULL DEFAULT 'active',
	`notificationMethod` varchar(50) NOT NULL DEFAULT 'email',
	`recipientEmail` varchar(320),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastNotifiedAt` timestamp,
	`notes` text,
	CONSTRAINT `stockAlerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `backups` ADD CONSTRAINT `backups_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cashTransactions` ADD CONSTRAINT `cashTransactions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `productCategories` ADD CONSTRAINT `productCategories_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `productImports` ADD CONSTRAINT `productImports_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_productCategories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `productCategories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saleItems` ADD CONSTRAINT `saleItems_saleId_sales_id_fk` FOREIGN KEY (`saleId`) REFERENCES `sales`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saleItems` ADD CONSTRAINT `saleItems_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_customerId_customers_id_fk` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stockAlerts` ADD CONSTRAINT `stockAlerts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stockAlerts` ADD CONSTRAINT `stockAlerts_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_backups_userId` ON `backups` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_backups_createdAt` ON `backups` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_cashTransactions_userId` ON `cashTransactions` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_cashTransactions_transactionDate` ON `cashTransactions` (`transactionDate`);--> statement-breakpoint
CREATE INDEX `idx_cashTransactions_type` ON `cashTransactions` (`type`);--> statement-breakpoint
CREATE INDEX `idx_customers_userId` ON `customers` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_customers_email` ON `customers` (`email`);--> statement-breakpoint
CREATE INDEX `idx_customers_phone` ON `customers` (`phone`);--> statement-breakpoint
CREATE INDEX `idx_productCategories_userId` ON `productCategories` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_productImports_userId` ON `productImports` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_productImports_status` ON `productImports` (`status`);--> statement-breakpoint
CREATE INDEX `idx_products_userId` ON `products` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_products_sku` ON `products` (`sku`);--> statement-breakpoint
CREATE INDEX `idx_products_barcode` ON `products` (`barcode`);--> statement-breakpoint
CREATE INDEX `idx_products_active` ON `products` (`active`);--> statement-breakpoint
CREATE INDEX `idx_saleItems_saleId` ON `saleItems` (`saleId`);--> statement-breakpoint
CREATE INDEX `idx_saleItems_productId` ON `saleItems` (`productId`);--> statement-breakpoint
CREATE INDEX `idx_sales_userId` ON `sales` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_sales_saleDate` ON `sales` (`saleDate`);--> statement-breakpoint
CREATE INDEX `idx_sales_customerId` ON `sales` (`customerId`);--> statement-breakpoint
CREATE INDEX `idx_sales_status` ON `sales` (`status`);--> statement-breakpoint
CREATE INDEX `idx_stockAlerts_userId` ON `stockAlerts` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_stockAlerts_productId` ON `stockAlerts` (`productId`);--> statement-breakpoint
CREATE INDEX `idx_stockAlerts_status` ON `stockAlerts` (`status`);